import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/utils/price";

interface SimulatedCardFormProps {
    totalPrice: number;
    email: string;
    address: string;
    onPaymentSuccess: () => Promise<void>;
}

const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
};

const SimulatedCardForm = ({ totalPrice, email, address, onPaymentSuccess }: SimulatedCardFormProps) => {
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);

    const processingMessages = [
        "Validating card details...",
        "Contacting your bank...",
        "Authorizing payment...",
        "Confirming transaction...",
        "Finalizing order...",
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !address) {
            toast.error("Please fill in your email and delivery address first.");
            return;
        }

        const rawDigits = cardNumber.replace(/\s/g, "");
        if (rawDigits.length < 16) {
            toast.error("Please enter a valid 16-digit card number.");
            return;
        }

        const [month, year] = expiry.split("/");
        const expMonth = parseInt(month, 10);
        const expYear = parseInt("20" + year, 10);
        const now = new Date();
        if (!month || !year || expMonth < 1 || expMonth > 12 || expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
            toast.error("Please enter a valid expiry date.");
            return;
        }

        if (cvv.length < 3) {
            toast.error("Please enter a valid CVV.");
            return;
        }

        if (!cardName.trim()) {
            toast.error("Please enter the cardholder name.");
            return;
        }

        setIsProcessing(true);
        setProcessingStep(0);

        // Cycle through processing messages over 5 seconds
        for (let i = 1; i <= 4; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setProcessingStep(i);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            await onPaymentSuccess();
        } catch {
            toast.error("Payment processing failed. Please try again.");
            setIsProcessing(false);
            setProcessingStep(0);
        }
    };

    if (isProcessing) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
                    <CreditCard className="w-6 h-6 text-gold absolute inset-0 m-auto" />
                </div>
                <p className="text-sm font-medium text-foreground">{processingMessages[processingStep]}</p>
                <div className="flex gap-1 mt-2">
                    {processingMessages.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 w-6 rounded-full transition-all duration-500 ${i <= processingStep ? "bg-gold" : "bg-border"}`}
                        />
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">Please do not close this page</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <div className="space-y-2">
                <label className="text-sm font-medium">Cardholder Name</label>
                <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-background border border-border focus:border-gold outline-none transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Card Number</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        inputMode="numeric"
                        required
                        className="w-full p-3 pr-10 rounded-lg bg-background border border-border focus:border-gold outline-none transition-colors font-mono tracking-widest"
                    />
                    <CreditCard className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        inputMode="numeric"
                        required
                        className="w-full p-3 rounded-lg bg-background border border-border focus:border-gold outline-none transition-colors font-mono"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">CVV</label>
                    <input
                        type="password"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        inputMode="numeric"
                        required
                        className="w-full p-3 rounded-lg bg-background border border-border focus:border-gold outline-none transition-colors font-mono"
                    />
                </div>
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full mt-6">
                Pay {formatPrice(totalPrice)}
            </Button>

        </form>
    );
};

export default SimulatedCardForm;
