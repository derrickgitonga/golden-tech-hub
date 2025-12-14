import { useState } from "react";
import { useProducts, Product } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Admin = () => {
    const { products, addProduct, deleteProduct } = useProducts();
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

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16 container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <h1 className="font-display text-4xl font-light text-foreground mb-8">
                        Admin <span className="text-gradient-gold">Dashboard</span>
                    </h1>

                    <div className="bg-card border border-border rounded-xl p-8">
                        <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <Label htmlFor="originalPrice">Original Price ($)</Label>
                                    <Input
                                        id="originalPrice"
                                        name="originalPrice"
                                        type="number"
                                        value={formData.originalPrice}
                                        onChange={handleChange}
                                        placeholder="1099"
                                    />
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
                                    <Label htmlFor="rating">Rating (0-5)</Label>
                                    <Input
                                        id="rating"
                                        name="rating"
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={formData.rating}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reviews">Review Count</Label>
                                    <Input
                                        id="reviews"
                                        name="reviews"
                                        type="number"
                                        value={formData.reviews}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="badge">Badge (Optional)</Label>
                                    <Input
                                        id="badge"
                                        name="badge"
                                        value={formData.badge}
                                        onChange={handleChange}
                                        placeholder="e.g. Bestseller"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Product Images *</Label>
                                <div className="space-y-3">
                                    {formData.imageUrls.map((url, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={url}
                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                                placeholder={`Image URL ${index + 1}`}
                                                required={index === 0}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeImageField(index)}
                                                className="shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addImageField}
                                        className="w-full"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Another Image
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
                                    placeholder="Enter product description..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Product Features</Label>
                                <div className="space-y-3">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                placeholder={`Feature ${index + 1}`}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeFeatureField(index)}
                                                className="shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addFeatureField}
                                        className="w-full"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Another Feature
                                    </Button>
                                </div>
                            </div>

                            <Button type="submit" variant="gold" className="w-full">
                                Add Product
                            </Button>
                        </form>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-2xl font-light text-foreground mb-6">Manage Products</h2>
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-secondary/50 border-b border-border">
                                        <tr>
                                            <th className="p-4 font-medium text-muted-foreground">Product</th>
                                            <th className="p-4 font-medium text-muted-foreground">Brand</th>
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
                                                        <span className="font-medium">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-muted-foreground">{product.brand}</td>
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
                                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                                    No products found. Add one above!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Admin;
