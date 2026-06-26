import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import type { CartItem } from "@/contexts/CartContext";
import { formatPrice } from "@/utils/price";

export interface StripeOrderContext {
    email: string;
    address: string;
    items: CartItem[];
    totalPrice: number;
    paymentMethod: string;
}

const SESSION_KEY = "_stripe_pending_order";

interface StripeCheckoutFormProps {
    totalPrice: number;
    email: string;
    address: string;
    items: CartItem[];
    paymentMethod: string;
    onPaymentSuccess: (paymentIntentId: string) => Promise<void>;
}

const StripeCheckoutForm = ({
    totalPrice,
    email,
    address,
    items,
    paymentMethod,
    onPaymentSuccess,
}: StripeCheckoutFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !address) {
            toast.error("Please fill in your email and delivery address first.");
            return;
        }

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        // Persist order context before Stripe takes over — required for redirect-based
        // payment methods (iDEAL, SOFORT, bank redirects) where the page reloads on return.
        const orderContext: StripeOrderContext = { email, address, items, totalPrice, paymentMethod };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(orderContext));

        // Triggers Stripe's internal field validation before confirmation
        const { error: submitError } = await elements.submit();
        if (submitError) {
            sessionStorage.removeItem(SESSION_KEY);
            setErrorMessage(submitError.message ?? "Please check your payment details.");
            setIsProcessing(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                receipt_email: email,
                // Fallback URL for redirect-based payment methods only.
                // Card + 3DS payments are handled in-page by Stripe — no redirect occurs.
                return_url: `${window.location.origin}/order-confirmation`,
            },
            redirect: "if_required",
        });

        if (error) {
            sessionStorage.removeItem(SESSION_KEY);
            if (error.type === "card_error" || error.type === "validation_error") {
                setErrorMessage(error.message ?? "Your card was declined.");
            } else {
                toast.error("Payment failed. Please try again.");
            }
            setIsProcessing(false);
            return;
        }

        // Payment confirmed in-page (no redirect). Clean up session and complete order.
        sessionStorage.removeItem(SESSION_KEY);
        const intentId = paymentIntent?.id ?? "";

        try {
            await onPaymentSuccess(intentId);
        } catch {
            // Payment was charged — order creation failed. Give the user a reference.
            toast.error(
                intentId
                    ? `Payment confirmed (ref: ${intentId}) but order creation failed. Please contact support with this reference.`
                    : "Payment confirmed but order creation failed. Please contact support."
            );
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement
                options={{
                    layout: "tabs",
                    loader: "auto",
                }}
            />

            {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                </div>
            )}

            <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full mt-6"
                disabled={isProcessing || !stripe || !elements}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pay {formatPrice(totalPrice)}
                    </>
                )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                Secured by Stripe. Your card details are never shared with us.
            </p>
        </form>
    );
};

export default StripeCheckoutForm;
