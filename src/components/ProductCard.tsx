import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description?: string;
  like_count?: number;
}

const ProductCard = ({
  id,
  name,
  price,
  image_url,
  category,
  description,
  like_count = 0,
}: ProductCardProps) => {
  const [likes, setLikes] = useState(like_count);
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 🧠 Safely get Supabase Auth user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1️⃣ Check if a session exists first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn("Session check error:", sessionError.message);
          return;
        }

        if (!session) {
          // no active session = user not logged in
          setUserId(null);
          return;
        }

        // 2️⃣ Fetch user safely
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Auth fetch error:", error.message);
          return;
        }

        setUserId(user?.id || null);
      } catch (err) {
        console.error("Unexpected auth error:", err);
      }
    };

    fetchUser();

    // 3️⃣ Keep in sync with login/logout
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // ✅ Check if product already liked
  useEffect(() => {
    if (!userId) return;

    const checkLike = async () => {
      const { data, error } = await supabase
        .from("product_likes")
        .select("id")
        .eq("product_id", id)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Check like error:", error.message);
        return;
      }

      if (data) setLiked(true);
    };

    checkLike();
  }, [id, userId]);

  // 💖 Handle like button click
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please log in to like products.");
      return;
    }

    if (liked) {
      toast.info("You already liked this product.");
      return;
    }

    setLiked(true);
    setLikes((prev) => prev + 1);

    try {
      // 1️⃣ Insert like record
      const { error: likeError } = await supabase.from("product_likes").insert([
        {
          product_id: id,
          user_id: userId,
        },
      ]);
      if (likeError) throw likeError;

      // 2️⃣ Increment like count in products table
      const { error: rpcError } = await supabase.rpc("increment_like_count", {
        product_id_input: id,
      });
      if (rpcError) throw rpcError;

      toast.success("You liked this product!");
    } catch (err: any) {
      console.error("Like save error:", err);
      setLiked(false);
      setLikes((prev) => prev - 1);
      toast.error("Error saving like.");
    }
  };

  // 🛒 Add to Cart
  const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem("shopping_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("shopping_session_id", sessionId);
    }
    return sessionId;
  };

  const addToCart = () => {
    const sessionId = getOrCreateSessionId();
    const cartItems = JSON.parse(localStorage.getItem(`cart_${sessionId}`) || "[]");
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === id);

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ id, name, price, image_url, quantity: 1, category });
    }

    localStorage.setItem(`cart_${sessionId}`, JSON.stringify(cartItems));
    toast.success("Added to cart!");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <Card className="group overflow-hidden hover:shadow-[0_12px_40px_-10px_hsl(30_20%_15%_/_0.2)] transition-all duration-400">
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden bg-secondary/30 aspect-square">
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <button
            onClick={handleLike}
            className="absolute top-4 right-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
          >
            <Heart
              className={`h-4 w-4 transition-colors duration-200 ${
                liked ? "fill-red-500 text-red-500" : "fill-gray-500 text-gray-500"
              }`}
            />
            <span className="text-sm font-medium text-foreground">{likes}</span>
          </button>
        </div>
      </Link>

      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{category}</p>
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        {description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
        )}
        <p className="text-xl font-bold text-primary mt-2">
          ₹{price.toLocaleString("en-IN")}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button onClick={addToCart} variant="outline" className="flex-1">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        <Link to={`/checkout?product=${id}`} className="flex-1">
          <Button className="w-full btn-gold">Buy Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
