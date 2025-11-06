import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import * as OTPAuth from "otpauth";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { queryAdminTwoFactor } from "@/lib/supabase-helpers";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, userRole, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user && userRole === 'admin') {
      navigate("/admin/dashboard");
    }
  }, [user, userRole, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error("No user found");

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roles) {
        await supabase.auth.signOut();
        toast.error("Access denied. Admin privileges required.");
        return;
      }

      // Check if 2FA secret exists
      const twofaResponse = await queryAdminTwoFactor
        .select("secret")
        .eq("user_id", user.id)
        .maybeSingle();

      if (twofaResponse.data?.secret) {
        setSecret(twofaResponse.data.secret);
        setShowOtp(true);
        toast.info("Enter your 2FA code from Google Authenticator");
      } else {
        const newSecret = new OTPAuth.Secret();
        await queryAdminTwoFactor.insert({
          user_id: user.id,
          secret: newSecret.base32,
        });

        const totp = new OTPAuth.TOTP({
          issuer: "HarshKanganStore",
          label: email,
          algorithm: "SHA1",
          digits: 6,
          period: 30,
          secret: newSecret,
        });

        const otpAuthUrl = totp.toString();
        toast.info("Scan this QR in Google Authenticator to enable 2FA");

        navigate(`/admin/setup-2fa?otpauth=${encodeURIComponent(otpAuthUrl)}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) return;
    setLoading(true);

    try {
      const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(secret),
        digits: 6,
        period: 30,
      });

      const delta = totp.validate({ token: otp, window: 1 });
      if (delta === null) throw new Error("Invalid 2FA code");

      toast.success("2FA verified successfully!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Admin Login</CardTitle>
          <p className="text-muted-foreground">Harsh Kangan Store</p>
        </CardHeader>
        <CardContent>
          {!showOtp ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@harshkangan.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full btn-gold" size="lg" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp">2FA Code</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>
              <Button type="submit" className="w-full btn-gold" size="lg" disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
