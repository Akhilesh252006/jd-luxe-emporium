import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { queryProductLikes, queryProducts } from "@/lib/supabase-helpers";

const SavedProducts = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/saved');
      return;
    }
    if (user) {
      fetchSavedProducts();
    }
  }, [user, authLoading, navigate]);

  const fetchSavedProducts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const likesResponse = await queryProductLikes
        .select('product_id')
        .eq('user_id', user.id);

      const likes = likesResponse.data;
      if (likesResponse.error) throw likesResponse.error;

      if (!likes || likes.length === 0) {
        setSavedProducts([]);
        setLoading(false);
        return;
      }

      const productIds = likes.map((like: any) => like.product_id);
      const productsResponse = await queryProducts
        .select('*')
        .in('id', productIds)
        .eq('is_active', true)
        .order('like_count', { ascending: false });

      if (productsResponse.error) throw productsResponse.error;
      setSavedProducts(productsResponse.data || []);
    } catch (error) {
      setSavedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Rings", "Necklaces", "Earrings", "Bangles", "Chains"];
  
  const filteredProducts = selectedCategory === "All" 
    ? savedProducts 
    : savedProducts.filter(p => p.category === selectedCategory);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Saved Products</h1>

        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No saved products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedProducts;
