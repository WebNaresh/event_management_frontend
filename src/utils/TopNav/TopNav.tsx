"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthToken } from "@/hooks/useAuthToken";
import { Apps } from "@mui/icons-material";
import { LogIn, LogOut, ScanBarcode } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function TopNav() {
  const { token, removeToken, getDecodeToken } = useAuthToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const dashboard = () => {
    if (getDecodeToken()?.role === "SECURITY") return "/security/dashboard";
    if (getDecodeToken()?.role === "USER") return "/user/dashboard";
    if (getDecodeToken()?.role === "ADMIN") return "/super_admin/dashboard";
    if (getDecodeToken()?.role === "SUPER_ADMIN")
      return "/super_admin/dashboard";
    return "/dashboard";
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          {token && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Apps className="h-5 w-5 text-primary" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Link to="/qr_code" className="flex items-center gap-2">
                    <ScanBarcode className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold text-primary">
                      Show QR
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to={dashboard()} className="flex items-center gap-2">
                    <ScanBarcode className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold text-primary">
                      Dashboard
                    </span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <h2 className="text-lg font-bold text-primary">ESM</h2>
        </div>
        {token ? (
          <>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-primary" />
              <span className="sr-only">Logout</span>
            </Button>
          </>
        ) : (
          <Link to="/login" className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-primary">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
