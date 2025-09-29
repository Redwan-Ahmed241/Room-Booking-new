import React, { useEffect, useState } from "react";
import { getUserProfile } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Logo from "../components/Logo";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.username) {
        try {
          const data = await getUserProfile(user.username);
          setProfile(data);
        } catch (err: any) {
          setError(err.message || "Failed to load profile");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:w-full sm:max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <Logo className="h-16 w-16 mb-2" />
            <h1 className="text-xl font-bold">Your Profile</h1>
            <CardDescription className="text-gray-600">
              View and manage your account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile && (
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Username:</span>{" "}
                  {profile.username}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {profile.email}
                </div>
                <div>
                  <span className="font-semibold">Mobile No:</span>{" "}
                  {profile.mobile_no}
                </div>
                <div>
                  <span className="font-semibold">Role:</span> {profile.role}
                </div>
                <div>
                  <span className="font-semibold">First Name:</span>{" "}
                  {profile.first_name || "-"}
                </div>
                <div>
                  <span className="font-semibold">Last Name:</span>{" "}
                  {profile.last_name || "-"}
                </div>
              </div>
            )}
            <div className="mt-6 text-center">
              <Button
                onClick={logout}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
