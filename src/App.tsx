import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "./components/CartDrawer";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";

// Lazy load pages
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="p-8 bg-card rounded-lg border border-destructive/50 text-center max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-4">Configuration Error</h1>
          <p className="mb-4">Missing Clerk Publishable Key.</p>
          <p className="text-sm text-muted-foreground">
            Please add <code className="bg-muted px-1 py-0.5 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> to your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <CartDrawer />
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/category/:category" element={<CategoryPage />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                      <Route path="/orders" element={<OrderHistory />} />
                      <Route path="/coming-soon" element={<ComingSoon />} />
                      <Route path="/search" element={<CategoryPage />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
