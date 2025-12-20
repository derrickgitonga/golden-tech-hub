import { useState, useEffect } from "react";
import { useProducts, Product } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, X, Package, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

interface Order {
    id: number;
    created_at: string;
    customer_email: string;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: any[];
    payment_method: string;
}

const Admin = () => {
    const { products, addProduct, deleteProduct } = useProducts();
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        price: "",
        originalPrice: "",
        rating: "5",
        reviews: "0",
        imageUrls: [""] as string[],
        badge: "",
        category: "smartphones",
        description: "",
        features: [""] as string[],
    });

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoadingOrders(false);
        }
    };

    const updateOrderStatus = async (orderId: number, newStatus: Order['status'], customerEmail: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

            toast.success(`Order #${orderId} status updated to ${newStatus}`);

            // Send status update email
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'status_update',
                    email: customerEmail,
                    orderId: orderId.toString(),
                    status: newStatus
                })
            });

        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update order status");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.brand || !formData.price || formData.imageUrls.every(url => !url.trim())) {
            toast.error("Please fill in all required fields and at least one image URL");
            return;
        }

        const validImages = formData.imageUrls.filter(url => url.trim() !== "");
        const validFeatures = formData.features.filter(feature => feature.trim() !== "");

        const newProduct: Omit<Product, "id"> = {
            name: formData.name,
            brand: formData.brand,
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
            rating: Number(formData.rating),
            reviews: Number(formData.reviews),
            images: validImages,
            badge: formData.badge || undefined,
            category: formData.category,
            description: formData.description,
            features: validFeatures,
        };

        await addProduct(newProduct);
        toast.success("Product added successfully!");

        // Reset form
        setFormData({
            name: "",
            brand: "",
            price: "",
            originalPrice: "",
            rating: "5",
            reviews: "0",
            imageUrls: [""],
            badge: "",
            category: "smartphones",
            description: "",
            features: [""],
        });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(id);
            toast.success("Product deleted successfully");
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const newImageUrls = [...formData.imageUrls];
        newImageUrls[index] = value;
        setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
    };

    const removeImageField = (index: number) => {
        if (formData.imageUrls.length === 1) {
            handleImageChange(0, "");
            return;
        }
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeatureField = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
    };

    const removeFeatureField = (index: number) => {
        if (formData.features.length === 1) {
            handleFeatureChange(0, "");
            return;
        }
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16 container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="font-display text-4xl font-light text-foreground">
                            Admin <span className="text-gradient-gold">Dashboard</span>
                        </h1>
                        <div className="flex gap-4">
                            <Button
                                variant={activeTab === 'products' ? 'gold' : 'outline'}
                                onClick={() => setActiveTab('products')}
                            >
                                Products
                            </Button>
                            <Button
                                variant={activeTab === 'orders' ? 'gold' : 'outline'}
                                onClick={() => setActiveTab('orders')}
                            >
                                Orders
                            </Button>
                        </div>
                    </div>

                    {activeTab === 'products' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="bg-card border border-border rounded-xl p-8 sticky top-24">
                                    <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Product Name *</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="e.g. iPhone 15 Pro"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="brand">Brand *</Label>
                                                <Input
                                                    id="brand"
                                                    name="brand"
                                                    value={formData.brand}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Apple"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="price">Price ($) *</Label>
                                                    <Input
                                                        id="price"
                                                        name="price"
                                                        type="number"
                                                        value={formData.price}
                                                        onChange={handleChange}
                                                        placeholder="999"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="originalPrice">Original ($)</Label>
                                                    <Input
                                                        id="originalPrice"
                                                        name="originalPrice"
                                                        type="number"
                                                        value={formData.originalPrice}
                                                        onChange={handleChange}
                                                        placeholder="1099"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category</Label>
                                                <select
                                                    id="category"
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="smartphones">Smartphones</option>
                                                    <option value="laptops">Laptops</option>
                                                    <option value="audio">Audio</option>
                                                    <option value="wearables">Wearables</option>
                                                    <option value="accessories">Accessories</option>
                                                    <option value="tablets">Tablets</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Images *</Label>
                                                <div className="space-y-2">
                                                    {formData.imageUrls.map((url, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <Input
                                                                value={url}
                                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                                                placeholder="Image URL"
                                                                required={index === 0}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => removeImageField(index)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button type="button" variant="outline" size="sm" onClick={addImageField} className="w-full">
                                                        <Plus className="w-4 h-4 mr-2" /> Add Image
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    placeholder="Product description..."
                                                    className="min-h-[80px]"
                                                />
                                            </div>
                                        </div>

                                        <Button type="submit" variant="gold" className="w-full">
                                            Add Product
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-card border border-border rounded-xl overflow-hidden">
                                    <div className="p-6 border-b border-border">
                                        <h2 className="text-xl font-semibold">Manage Products</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-secondary/50 border-b border-border">
                                                <tr>
                                                    <th className="p-4 font-medium text-muted-foreground">Product</th>
                                                    <th className="p-4 font-medium text-muted-foreground">Price</th>
                                                    <th className="p-4 font-medium text-muted-foreground">Category</th>
                                                    <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {products.map((product) => (
                                                    <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-md overflow-hidden bg-background border border-border">
                                                                    <img
                                                                        src={product.images[0]}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{product.name}</span>
                                                                    <span className="text-xs text-muted-foreground">{product.brand}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-medium">${product.price}</td>
                                                        <td className="p-4 text-muted-foreground capitalize">{product.category || "-"}</td>
                                                        <td className="p-4 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleDelete(product.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {products.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                            No products found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Customer Orders</h2>
                                <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loadingOrders}>
                                    Refresh
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-secondary/50 border-b border-border">
                                        <tr>
                                            <th className="p-4 font-medium text-muted-foreground">Order ID</th>
                                            <th className="p-4 font-medium text-muted-foreground">Date</th>
                                            <th className="p-4 font-medium text-muted-foreground">Customer</th>
                                            <th className="p-4 font-medium text-muted-foreground">Total</th>
                                            <th className="p-4 font-medium text-muted-foreground">Status</th>
                                            <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                                                <td className="p-4 font-mono text-sm">#{order.id}</td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{order.customer_email}</span>
                                                        <span className="text-xs text-muted-foreground">{order.payment_method}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-medium">${order.total_amount.toLocaleString()}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <select
                                                            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any, order.customer_email)}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                                    {loadingOrders ? "Loading orders..." : "No orders found yet."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Admin;
