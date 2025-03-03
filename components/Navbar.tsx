"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Rocket, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "sticky top-0 left-0 w-full bg-gradient-to-br to-purple-600 from-blue-500",
      "shadow-xl backdrop-blur-md transition-all duration-300 z-50",
      scrolled ? "h-16" : "h-20",
      "border-b border-white/20"
    )}>
      <div className="relative h-full max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Animated Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 group"
        >
          <div className={cn(
            "bg-white rounded-full p-2 transition-all duration-300",
            "group-hover:rotate-12 group-hover:scale-110"
          )}>
            <Rocket className="w-6 h-6 text-purple-600" />
          </div>
          <span className={cn(
            "text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white",
            "bg-clip-text text-transparent transition-all duration-300",
            "group-hover:text-shadow-glow"
          )}>
            Code Nexus
          </span>
        </Link>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <div className="relative">
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="w-12 h-12 border-2 border-white/20 hover:border-white/40 transition-all group">
                    <AvatarFallback className="bg-white/10 text-white text-xl font-bold backdrop-blur-md">
                      {user.name?.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <div className="absolute inset-0 rounded-full pointer-events-none transition-all group-hover:animate-pulse" />
              </div>

              <DropdownMenuContent
                align="end"
                className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-xl w-48 py-2 mt-2"
              >
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-gray-200/50" />

                <DropdownMenuItem
                  className="cursor-pointer flex gap-3 items-center px-4 py-2 hover:bg-purple-50/80"
                  onClick={() => router.push("/")}
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">Dashboard</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer flex gap-3 items-center px-4 py-2 hover:bg-purple-50/80"
                  onClick={() => router.push("/profile")}
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Profile</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-200/50" />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer flex gap-3 items-center px-4 py-2 text-red-600 hover:bg-red-50/80"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => router.push("/signin")}
              className={cn(
                "relative overflow-hidden group bg-gradient-to-r from-purple-500 to-blue-500",
                "text-white shadow-lg hover:shadow-xl",
                "hover:scale-105 transition-all duration-300"
              )}
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;