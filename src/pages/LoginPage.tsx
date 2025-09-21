import React, { useState } from "react";
import { login } from "../lib/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../components/ui/card";
import Logo from "../components/Logo";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const PasswordInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}> = ({ value, onChange, showPassword, setShowPassword }) => (
  <div className="relative mt-1">
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      required
      value={value}
      onChange={onChange}
      placeholder="Enter your password"
      autoComplete="current-password"
      className="pr-10 w-full"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
    >
      {showPassword ? (
        <EyeOff className="h-4 w-4 text-gray-400" />
      ) : (
        <Eye className="h-4 w-4 text-gray-400" />
      )}
    </button>
  </div>
);

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
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Invalid username or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:w-full sm:max-w-md">
        <Card className="shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <Logo className="h-16 w-16 mb-2" />
            <h1 className="text-xl font-bold">Welcome Back</h1>
          </div>
          <CardHeader className="text-center">
            <CardDescription className="text-gray-600">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
                <div className="mt-2 text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-pink-500 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/register"
                className="inline-block px-6 py-2 text-sm font-medium text-white bg-pink-500 rounded-md hover:bg-pink-600"
              >
                Create Account
              </Link>
            </div>
            <div className="mt-4 text-center">
              <Button
                onClick={() => navigate("/admin/login")}
                className="inline-block px-6 py-2 text-sm font-medium text-white bg-pink-500 rounded-md hover:bg-pink-600"
              >
                Admin Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
