import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, AlertCircle } from "lucide-react";

interface Order {
    id: number;
    created_at: string;
    customer_email: string;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'Approved, Shipping in progress';
    items: any[];
    payment_method: string;
}

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            // Check if order data was passed via navigation state
            if (location.state?.order) {
                setOrder(location.state.order);
                setLoading(false);
                return;
            }

            if (!orderId) return;

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single();

                if (error) throw error;
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Failed to load order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, location.state]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'processing': return 'text-blue-600 bg-blue-100';
            case 'shipped': return 'text-purple-600 bg-purple-100';
            case 'delivered': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            case 'Approved, Shipping in progress': return 'text-indigo-600 bg-indigo-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center pt-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center pt-24 px-4 text-center">
                    <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
                    <p className="text-muted-foreground mb-6">{error || "We couldn't find the order you're looking for."}</p>
                    <Link to="/">
                        <Button variant="gold">Return Home</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-24 pb-16 container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="font-display text-4xl font-light text-foreground mb-4">
                            Order <span className="text-gradient-gold">Confirmed!</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Thank you for your purchase. Your order #{order.id} has been placed.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Order Date</p>
                                <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Payment Method</p>
                                <p className="font-medium capitalize">{order.payment_method}</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                Order Items
                            </h3>
                            <div className="space-y-4">
                                {order.items.map((item: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-secondary rounded-md overflow-hidden">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-border">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total Amount</span>
                                    <span>${order.total_amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/30 p-6 border-t border-border">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-primary" />
                                What's Next?
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                You will receive an email confirmation shortly at <span className="font-medium text-foreground">{order.customer_email}</span>.
                                We will notify you again when your order ships.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link to="/">
                            <Button variant="outline" size="lg">Continue Shopping</Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderConfirmation;
