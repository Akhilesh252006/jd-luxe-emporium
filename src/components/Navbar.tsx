import { Link } from "react-router-dom";
import { ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    loadCartCount();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      setIsAdmin(!!roles);
    }
  };

  const loadCartCount = () => {
    const sessionId = getOrCreateSessionId();
    const cartItems = JSON.parse(localStorage.getItem(`cart_${sessionId}`) || '[]');
    setCartCount(cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0));
  };

  const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('shopping_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('shopping_session_id', sessionId);
    }
    return sessionId;
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="hover:text-primary transition-colors">Home</Link>
      <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
      <Link to="/about" className="hover:text-primary transition-colors">About</Link>
      <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="JD Jewellers" className="h-12 md:h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-base font-medium">
            <NavLinks />
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-scale-in">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[280px]">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex justify-center mb-4">
                    <img src={logo} alt="JD Jewellers" className="h-16 w-auto" />
                  </div>
                  <div className="flex flex-col space-y-4 text-lg font-medium">
                    <NavLinks />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;