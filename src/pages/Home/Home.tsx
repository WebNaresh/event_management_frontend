"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthToken } from "@/hooks/useAuthToken";
import { CalendarDays, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EVENT_LIST from "../USER_DASH/_components/events_map";

// Assume these hooks and components exist in your project

export default function HomePage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { removeToken, getDecodeToken } = useAuthToken();
  const user = getDecodeToken();

  useEffect(() => {
    if (user) {
      setUserRole(user.role);
    }
  }, [user]);

  // redirect user to login page if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">
          Event Security Management System
        </h1>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={
                "https://static.wixstatic.com/media/23f4f1_b89e82c4266c4daf8fc8ece7ef55ff14~mv2.jpg/v1/fill/w_400,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Garima%20Avtar.jpg"
              }
              alt={user?.first_name}
            />
            <AvatarFallback>{user?.first_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{`${user?.first_name} ${user?.last_name}`}</p>
            <p className="text-sm text-muted-foreground">{userRole}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
              <Link
                to={
                  userRole === "ADMIN"
                    ? "/admin/dashboard"
                    : "/super_admin/dashboard"
                }
              >
                <Button className="w-full">
                  <CalendarDays className="mr-2 h-4 w-4" /> Create New Event
                </Button>
              </Link>
            )}
            {userRole === "SuperAdmin" && (
              <Button className="w-full">
                <Users className="mr-2 h-4 w-4" /> Manage Users
              </Button>
            )}
            {userRole === "Security" && (
              <Button className="w-full">
                <ShieldCheck className="mr-2 h-4 w-4" /> View Assignments
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your next 3 events</CardDescription>
          </CardHeader>
          <CardContent>
            <EVENT_LIST />
          </CardContent>
        </Card>

        {userRole === "SuperAdmin" && (
          <Card>
            <CardHeader>
              <CardTitle>Security Assignments</CardTitle>
              <CardDescription>Recent assignments</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        )}

        {userRole === "User" && (
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
              <CardDescription>Events you have access to</CardDescription>
            </CardHeader>
            <CardContent>
              <EVENT_LIST />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
