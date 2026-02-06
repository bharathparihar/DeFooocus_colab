import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Store, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SellerAuth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        shopName: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!formData.email.includes("@")) {
            toast.error("Please enter a valid email");
            return;
        }

        if (!isLogin) {
            if (!formData.shopName) {
                toast.error("Please enter your shop name");
                return;
            }
            if (formData.password.length < 6) {
                toast.error("Password must be at least 6 characters");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords don't match");
                return;
            }
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Store seller info in localStorage
            localStorage.setItem(
                "seller",
                JSON.stringify({
                    email: formData.email,
                    shopName: formData.shopName || "My Shop",
                })
            );
            toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
            navigate("/dashboard");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
            {/* Header with Logo */}
            <div className="p-6 md:p-8">
                <Link to="/" className="flex items-center gap-2 w-fit">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center ec-shadow-glow">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">B Catalogue</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-0">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 ec-glass-card">
                        {/* Heading */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Store className="w-8 h-8 text-emerald-600" />
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {isLogin ? "Welcome Back" : "Start Selling"}
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                {isLogin
                                    ? "Sign in to your seller account"
                                    : "Create your seller account in seconds"}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Shop Name Field (Signup only) */}
                            {!isLogin && (
                                <div>
                                    <Label htmlFor="shopName" className="text-sm font-semibold text-gray-700 mb-2">
                                        Shop Name
                                    </Label>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="text"
                                            id="shopName"
                                            name="shopName"
                                            value={formData.shopName}
                                            onChange={handleChange}
                                            placeholder="My Awesome Shop"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder={isLogin ? "••••••••" : "At least 6 characters"}
                                        className="pl-10 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field (Signup only) */}
                            {!isLogin && (
                                <div>
                                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        {isLogin ? "Signing in..." : "Creating account..."}
                                    </>
                                ) : (
                                    <>
                                        {isLogin ? "Sign In" : "Create Account"}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-600">
                                        {isLogin ? "New to B Catalogue?" : "Already have an account?"}
                                    </span>
                                </div>
                            </div>

                            {/* Toggle Button */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setFormData({
                                        email: "",
                                        password: "",
                                        shopName: "",
                                        confirmPassword: "",
                                    });
                                }}
                                className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                            >
                                {isLogin
                                    ? "Create a new account"
                                    : "Sign in to existing account"}
                            </Button>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
                            <p>
                                By continuing, you agree to our{" "}
                                <a
                                    href="#"
                                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                    href="#"
                                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Back to Home Link */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-gray-900 font-medium transition"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        </div>
    );
}
