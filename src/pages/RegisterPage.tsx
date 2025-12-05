import React, { useState, useMemo } from "react";
import { register } from "../lib/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Phone,
  Lock,
  Loader2,
  UserPlus,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    mobile_no: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const data = await register(form);
      setSuccess(data.message || "Registration successful. Check your email.");
      // Clear form on success
      setForm({
        mobile_no: "",
        password: "",
        confirm_password: "",
      });
    } catch (err: any) {
      setError(
        err.message || "Registration failed. Please check your details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const homePageBackground = useMemo(
    () => (
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HomePage />
      </div>
    ),
    []
  );

  return (
    <>
      {/* Background HomePage */}
      {homePageBackground}

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 z-10">
        <div className="w-full max-w-sm max-h-[70vh] relative pointer-events-auto">
          {/* Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute -top-10 right-0 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Register Card */}
          <Card className="border-0 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] bg-white/90 backdrop-blur-md relative rounded-3xl overflow-y-auto">
            <div className="text-center pt-4 pb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg mb-2">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Sign Up
              </h2>
              <p className="mt-1 text-xs text-gray-600">
                Join us today and start your journey
              </p>
            </div>
            <CardContent className="space-y-3 pt-0 pb-4 px-6">
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="mobile_no" className="text-xs font-medium">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="mobile_no"
                      name="mobile_no"
                      type="text"
                      required
                      value={form.mobile_no}
                      onChange={handleChange}
                      className="pl-8 h-9 text-sm border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="pl-8 pr-10 h-9 text-sm border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center hover:opacity-70 transition-opacity"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="confirm_password"
                    className="text-xs font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={form.confirm_password}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="pl-8 pr-10 h-9 text-sm border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-2 flex items-center hover:opacity-70 transition-opacity"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-9 text-sm bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-pink-600 hover:text-pink-700"
                >
                  Sign in to your account →
                </Link>
              </div>

              {/* Back Button */}
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-600">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
