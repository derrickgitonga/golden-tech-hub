import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OrderItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    items: OrderItem[];
    payment_method: string;
}

const OrderHistory = () => {
    const { user, isLoaded } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.primaryEmailAddress?.emailAddress) return;

            try {
                const { data, error } = await supabase
                    .from("orders")
                    .select("*")
                    .eq("customer_email", user.primaryEmailAddress.emailAddress)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded) {
            if (!user) {
                // Not logged in
                setLoading(false);
            } else {
                fetchOrders();
            }
        }
    }, [user, isLoaded]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "delivered":
                return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
            case "shipping in progress":
            case "approved, shipping in progress":
                return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
            case "pending":
                return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
            case "cancelled":
                return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-2xl font-display font-bold mb-4">Please Sign In</h1>
                    <p className="text-muted-foreground mb-6">You need to be logged in to view your order history.</p>
                    <Button onClick={() => navigate("/auth")} variant="gold">
                        Sign In
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
                <h1 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                    <Package className="w-8 h-8 text-gold" />
                    Order History
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-border">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                        <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
                        <Button onClick={() => navigate("/")} variant="gold">
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Card key={order.id} className="overflow-hidden border-border hover:border-gold/50 transition-colors">
                                <CardHeader className="bg-muted/30 flex flex-row items-center justify-between pb-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CreditCard className="w-4 h-4" />
                                                {order.payment_method === "mpesa" ? "M-Pesa" : "Card"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                        <span className="font-bold text-lg">${order.total_amount.toLocaleString()}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium truncate">{item.name}</h4>
                                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">${item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default OrderHistory;
