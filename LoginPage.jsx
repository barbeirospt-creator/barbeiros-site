import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/app/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>Login - Barbeiros.pt</title>
        <meta name="description" content="Login to your Barbeiros.pt account to access premium barbershop community features." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome <span className="text-gradient-gold">Back</span>
            </h1>
            <p className="text-gray-400">Login to access your account</p>
          </div>

          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-center">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-800 bg-gray-900 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
                      Remember me
                    </label>
                  </div>

                  <Link to="/forgot-password" className="text-sm text-[#FFD700] hover:text-[#FFA500]">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FFD700] text-black hover:bg-[#FFA500]"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-[#FFD700] hover:text-[#FFA500]">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PublicLayout>
  );
}