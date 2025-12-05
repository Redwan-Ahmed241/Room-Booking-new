import React, { useState, useMemo } from "react";
import { login } from "../lib/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Lock,
  Loader2,
  Home,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      // Force a page reload to ensure auth state is updated
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Invalid username or password");
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
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10">
        <div className="w-full max-w-sm max-h-[65vh] relative pointer-events-auto">
          {/* Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute -top-10 right-0 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Login Card */}
          <Card className="border-0 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] bg-white/90 backdrop-blur-md relative rounded-3xl overflow-y-auto">
            <div className="text-center pt-4 pb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg mb-2">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="mt-1 text-xs text-gray-600">
                Sign in to continue to your account
              </p>
            </div>

            <CardContent className="space-y-3 pb-4 px-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="username" className="text-xs font-medium">
                    Username or Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-8 h-9 text-sm border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Enter your username"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-11 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
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
                    Don't have an account?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link
                  to="/register"
                  className="text-sm font-medium text-pink-600 hover:text-pink-700"
                >
                  Create new account →
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
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
