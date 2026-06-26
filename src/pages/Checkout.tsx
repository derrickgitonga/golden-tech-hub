import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import SimulatedCardForm from "@/components/SimulatedCardForm";
import { CreditCard, Smartphone, Loader2, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import StkPushModal from "@/components/StkPushModal";
import OptimizedImage from "@/components/OptimizedImage";
import { formatPrice, EXCHANGE_RATE } from "@/utils/price";

const StripeLogo = () => (
    <img src="/Stripe_Logo.png" alt="Stripe" className="w-16 h-6 object-contain" />
);

// Initialized once at module level — never inside a render
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    : null;

const stripeAppearance = {
    theme: "night" as const,
    variables: {
        colorPrimary: "#D4AF37",
        colorBackground: "#1a1a1a",
        colorText: "#ffffff",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "8px",
        spacingUnit: "4px",
    },
};

const Checkout = () => {
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card" | "stripe">("mpesa");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showStkModal, setShowStkModal] = useState(false);

    // Form state
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [mpesaNumber, setMpesaNumber] = useState("");

    // Stripe state
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoadingStripe, setIsLoadingStripe] = useState(false);

    const kshAmount = Math.round(totalPrice * EXCHANGE_RATE);

    // Pre-fetch PaymentIntent as soon as user switches to the stripe tab
    useEffect(() => {
        const usesStripe = paymentMethod === "stripe";
        if (!usesStripe || items.length === 0) {
            setClientSecret(null);
            return;
        }

        let cancelled = false;
        setIsLoadingStripe(true);
        setClientSecret(null);

        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Payment initialization failed");
                return res.json();
            })
            .then((data) => {
                if (!cancelled) setClientSecret(data.clientSecret);
            })
            .catch(() => {
                if (!cancelled) toast.error("Failed to initialize card payment. Please try again.");
            })
            .finally(() => {
                if (!cancelled) setIsLoadingStripe(false);
            });

        return () => {
            cancelled = true;
        };
    }, [paymentMethod]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleMpesaPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const productName = items.map((i) => i.name).join(", ");
        const accountRef = productName.length > 12 ? productName.substring(0, 12) : productName;

        let formattedPhone = mpesaNumber.replace(/\D/g, "");
        if (formattedPhone.startsWith("0")) {
            formattedPhone = "254" + formattedPhone.substring(1);
        } else if (formattedPhone.startsWith("7") || formattedPhone.startsWith("1")) {
            formattedPhone = "254" + formattedPhone;
        }

        setTimeout(() => {
            setShowStkModal(true);
            setIsProcessing(false);
        }, 5000);
    };

    const handleStkConfirm = async (_pin: string) => {
        setShowStkModal(false);
        setIsProcessing(true);

        toast.success("STK Push Sent!", {
            description: "Processing payment...",
            duration: 2000,
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
        await completeOrder();
    };

    const completeOrder = async (stripePaymentIntentId = "") => {
        let orderId = Math.floor(Math.random() * 1000000).toString();

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_email: email,
                    customer_phone: mpesaNumber || null,
                    total_amount: totalPrice,
                    status: "pending",
                    items,
                    payment_method: paymentMethod,
                }),
            });
            if (res.ok) {
                const orderData = await res.json();
                orderId = orderData.id.toString();
            } else {
                console.error("Failed to save order:", await res.text());
            }
        } catch (err) {
            console.error("Error saving order:", err);
        }

        try {
            await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "confirmation",
                    email,
                    address,
                    items,
                    total: totalPrice,
                    orderId,
                    paymentMethod: paymentMethod === "mpesa" ? "M-Pesa" : paymentMethod === "stripe" ? "Stripe" : "Card",
                }),
            });
        } catch (error) {
            console.error("Failed to send email:", error);
        }

        setIsProcessing(false);
        setIsSuccess(true);
        clearCart();
        toast.success("Payment successful!", {
            description: "Your order has been placed and a confirmation email sent.",
        });

        const orderDetails = {
            id: orderId,
            created_at: new Date().toISOString(),
            customer_email: email,
            total_amount: totalPrice,
            status: "pending",
            items,
            payment_method: paymentMethod,
        };

        setTimeout(() => {
            navigate(`/order-confirmation/${orderId}`, { state: { order: orderDetails } });
        }, 1000);
    };

    if (items.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-display text-foreground mb-4">Your cart is empty</h1>
                    <Button onClick={() => navigate("/")} variant="gold">
                        Start Shopping
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-display text-foreground mb-2">Order Confirmed!</h1>
                    <p className="text-muted-foreground mb-8 max-w-md">
                        Thank you for your purchase. You will receive a confirmation email shortly.
                    </p>
                    <Button onClick={() => navigate("/")} variant="gold">
                        Continue Shopping
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
                <h1 className="text-3xl font-display text-foreground mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-gold" />
                                Contact Information
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-background border border-border focus:border-gold outline-none transition-colors"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        We'll send your order confirmation and receipts to this email.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Delivery Address</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your delivery address"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-background border border-border focus:border-gold outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                            {/* Payment method tabs */}
                            <div className="flex gap-3 mb-8">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("mpesa")}
                                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                        paymentMethod === "mpesa"
                                            ? "border-gold bg-gold/5"
                                            : "border-border hover:border-gold/50"
                                    }`}
                                >
                                    <Smartphone
                                        className={`w-6 h-6 ${paymentMethod === "mpesa" ? "text-gold" : "text-muted-foreground"}`}
                                    />
                                    <span
                                        className={`text-sm font-medium ${paymentMethod === "mpesa" ? "text-foreground" : "text-muted-foreground"}`}
                                    >
                                        M-Pesa
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("card")}
                                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                        paymentMethod === "card"
                                            ? "border-gold bg-gold/5"
                                            : "border-border hover:border-gold/50"
                                    }`}
                                >
                                    <CreditCard
                                        className={`w-6 h-6 ${paymentMethod === "card" ? "text-gold" : "text-muted-foreground"}`}
                                    />
                                    <span
                                        className={`text-sm font-medium ${paymentMethod === "card" ? "text-foreground" : "text-muted-foreground"}`}
                                    >
                                        Card
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("stripe")}
                                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                                        paymentMethod === "stripe"
                                            ? "border-[#635BFF] bg-[#635BFF]/5"
                                            : "border-border hover:border-[#635BFF]/50"
                                    }`}
                                >
                                    <StripeLogo />
                                    <span
                                        className={`text-sm font-medium ${paymentMethod === "stripe" ? "text-[#635BFF]" : "text-muted-foreground"}`}
                                    >
                                        Stripe
                                    </span>
                                </button>
                            </div>

                            {/* M-Pesa form */}
                            {paymentMethod === "mpesa" && (
                                <form onSubmit={handleMpesaPayment} className="space-y-4 animate-fade-in">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">M-Pesa Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="07XX XXX XXX"
                                            required
                                            value={mpesaNumber}
                                            onChange={(e) => setMpesaNumber(e.target.value)}
                                            className="w-full p-3 rounded-lg bg-background border border-border focus:border-gold outline-none transition-colors"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            You will receive an M-Pesa prompt on your phone to complete the payment.
                                        </p>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="gold"
                                        size="lg"
                                        className="w-full mt-6"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending Request...
                                            </>
                                        ) : (
                                            `Pay KES ${kshAmount.toLocaleString()}`
                                        )}
                                    </Button>
                                </form>
                            )}

                            {/* Simulated card form */}
                            {paymentMethod === "card" && (
                                <SimulatedCardForm
                                    totalPrice={totalPrice}
                                    email={email}
                                    address={address}
                                    onPaymentSuccess={() => completeOrder()}
                                />
                            )}

                            {/* Real Stripe payment form */}
                            {paymentMethod === "stripe" && (
                                <div className="animate-fade-in">
                                    {isLoadingStripe ? (
                                        <div className="flex items-center justify-center py-10 gap-3 text-muted-foreground">
                                            <Loader2 className="w-5 h-5 animate-spin text-gold" />
                                            <span>Loading secure payment form...</span>
                                        </div>
                                    ) : clientSecret && stripePromise ? (
                                        <Elements
                                            key={clientSecret}
                                            stripe={stripePromise}
                                            options={{
                                                clientSecret,
                                                appearance: stripeAppearance,
                                            }}
                                        >
                                            <StripeCheckoutForm
                                                totalPrice={totalPrice}
                                                email={email}
                                                address={address}
                                                items={items}
                                                paymentMethod={paymentMethod}
                                                onPaymentSuccess={completeOrder}
                                            />
                                        </Elements>
                                    ) : (
                                        !isLoadingStripe && (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p>Stripe payment unavailable. Please try again.</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary">
                                            <OptimizedImage
                                                src={item.image}
                                                alt={item.name}
                                                objectFit="cover"
                                                sizes="64px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium truncate">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border pt-4 space-y-2">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border mt-2">
                                    <span>Total</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <StkPushModal
                isOpen={showStkModal}
                onClose={() => setShowStkModal(false)}
                onConfirm={handleStkConfirm}
                amount={kshAmount}
                accountReference={items
                    .map((i) => i.name)
                    .join(", ")
                    .substring(0, 12)}
            />
        </div>
    );
};

export default Checkout;
