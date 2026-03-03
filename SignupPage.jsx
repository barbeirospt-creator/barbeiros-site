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

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        data: {
          name: formData.name,
        },
      });

      toast({
        title: "Success!",
        description: "Account created successfully. Please check your email to verify your account.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>Register - Barbeiros.pt</title>
        <meta name="description" content="Create your Barbeiros.pt account and join the premium barbershop community." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Join <span className="text-gradient-gold">Barbeiros.pt</span>
            </h1>
            <p className="text-gray-400">Create your account and get started</p>
          </div>

          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-center">Register</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 mt-1 rounded border-gray-800 bg-gray-900 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                    I agree to the{" "}
                    <a href="#" className="text-[#FFD700] hover:text-[#FFA500]">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#FFD700] hover:text-[#FFA500]">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FFD700] text-black hover:bg-[#FFA500]"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#FFD700] hover:text-[#FFA500]">
                    Login
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