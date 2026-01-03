import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreditCard, Smartphone, Loader2, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import StkPushModal from "@/components/StkPushModal";

const EXCHANGE_RATE = 129; // 1 USD = 129 KSH

const Checkout = () => {
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card">("mpesa");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showStkModal, setShowStkModal] = useState(false);

    // Form states
    const [email, setEmail] = useState("");
    const [mpesaNumber, setMpesaNumber] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvc, setCardCvc] = useState("");

    const kshAmount = Math.round(totalPrice * EXCHANGE_RATE);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        if (paymentMethod === "mpesa") {
            // Create a description from cart items (max 12 chars for AccountReference)
            const productName = items.map(i => i.name).join(", ");
            const accountRef = productName.length > 12 ? productName.substring(0, 12) : productName;

            // Format phone number to 254...
            let formattedPhone = mpesaNumber.replace(/\D/g, ''); // Remove non-digits
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '254' + formattedPhone.substring(1);
            } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
                formattedPhone = '254' + formattedPhone;
            }

            // Show the STK Push Modal instead of calling API directly
            // Add 5-second delay before displaying STK push
            setTimeout(() => {
                setShowStkModal(true);
                setIsProcessing(false);
            }, 5000);
            return;
        } else {
            // Simulate Card processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            await completeOrder();
        }
    };

    const handleStkConfirm = async (pin: string) => {
        setShowStkModal(false);
        setIsProcessing(true);

        toast.success("STK Push Sent!", {
            description: "Processing payment...",
            duration: 2000,
        });

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        await completeOrder();
    };

    const completeOrder = async () => {
        // Save order to Supabase
        let orderId = Math.floor(Math.random() * 1000000).toString();

        try {
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([
                    {
                        customer_email: email,
                        customer_phone: mpesaNumber || null,
                        total_amount: totalPrice,
                        status: 'pending',
                        items: items,
                        payment_method: paymentMethod
                    }
                ])
                .select()
                .single();

            if (orderError) {
                console.error("Failed to save order:", orderError);
                // We continue even if save fails, but log it. In production, we might want to halt or retry.
            } else if (orderData) {
                orderId = orderData.id.toString();
            }
        } catch (err) {
            console.error("Error saving order:", err);
        }

        // Send confirmation email
        try {
            await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'confirmation',
                    email,
                    items,
                    total: totalPrice,
                    orderId: orderId,
                    paymentMethod: paymentMethod === "mpesa" ? "M-Pesa" : "Card"
                }),
            });
        } catch (error) {
            console.error("Failed to send email:", error);
            // Don't block success UI if email fails
        }

        setIsProcessing(false);
        setIsSuccess(true);
        clearCart();
        toast.success("Payment successful!", {
            description: "Your order has been placed and a confirmation email sent.",
        });

        // Redirect to order confirmation with state
        const orderDetails = {
            id: orderId,
            created_at: new Date().toISOString(),
            customer_email: email,
            total_amount: totalPrice,
            status: 'pending',
            items: items,
            payment_method: paymentMethod
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
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                            <div className="flex gap-4 mb-8">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("mpesa")}
                                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "mpesa"
                                        ? "border-gold bg-gold/5"
                                        : "border-border hover:border-gold/50"
                                        }`}
                                >
                                    <Smartphone className={`w-6 h-6 ${paymentMethod === "mpesa" ? "text-gold" : "text-muted-foreground"}`} />
                                    <span className={`font-medium ${paymentMethod === "mpesa" ? "text-foreground" : "text-muted-foreground"}`}>M-Pesa</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("card")}
                                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "card"
                                        ? "border-gold bg-gold/5"
                                        : "border-border hover:border-gold/50"
                                        }`}
                                >
                                    <CreditCard className={`w-6 h-6 ${paymentMethod === "card" ? "text-gold" : "text-muted-foreground"}`} />
                                    <span className={`font-medium ${paymentMethod === "card" ? "text-foreground" : "text-muted-foreground"}`}>Card</span>
                                </button>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-4">
                                {paymentMethod === "mpesa" ? (
                                    <div className="space-y-4 animate-fade-in">
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
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Card Number</label>
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                required
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                className="w-full p-3 rounded-lg bg-background border border-border focus:border-gold outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    required
                                                    value={cardExpiry}
                                                    onChange={(e) => setCardExpiry(e.target.value)}
                                                    className="w-full p-3 rounded-lg bg-background border border-border focus:border-gold outline-none transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">CVC</label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    required
                                                    value={cardCvc}
                                                    onChange={(e) => setCardCvc(e.target.value)}
                                                    className="w-full p-3 rounded-lg bg-background border border-border focus:border-gold outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                            {paymentMethod === "mpesa" ? "Sending Request..." : "Processing Payment..."}
                                        </>
                                    ) : (
                                        paymentMethod === "mpesa"
                                            ? `Pay KES ${kshAmount.toLocaleString()}`
                                            : `Pay $${totalPrice.toLocaleString()}`
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg bg-secondary"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium truncate">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border pt-4 space-y-2">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border mt-2">
                                    <span>Total (USD)</span>
                                    <span>${totalPrice.toLocaleString()}</span>
                                </div>
                                {paymentMethod === "mpesa" && (
                                    <div className="flex justify-between font-semibold text-lg pt-2 text-gold animate-fade-in">
                                        <span>Total (KES)</span>
                                        <span>KES {kshAmount.toLocaleString()}</span>
                                    </div>
                                )}
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
                accountReference={items.map(i => i.name).join(", ").substring(0, 12)}
            />
        </div>
    );
};

export default Checkout;
