"use client"
import { Home, Phone, User, ChefHat, CreditCard, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Show, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs";


const Navigation = () => {
  return (
    <nav className="flex items-center justify-between px-3 py-3 bg--background border-b">
      <Link
        href={"/"}
        className="text-lg font-extrabold text-primary flex items-center gap-2"
      >
        <ChefHat className="size-10 text-white" />
        <span className="text-white text-2xl">Crazy Goods</span>
      </Link>

      <div className="flex items-center sm:space-x-4 space-x-1">
        <Link
          href={"/"}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Home className="w-6 h-6 text-white" />
          <span className=" hidden sm:inline text-white">Home</span>
        </Link>
        <Link
          href={"/about"}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <User className="w-6 h-6 text-white" />
          <span className=" hidden sm:inline text-white">About</span>
        </Link>
        <Link
          href={"/contact"}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Phone className="w-6 h-6 text-white" />
          <span className=" hidden sm:inline text-white">Contact</span>
        </Link>

        <Show when="signed-in">
          <Link href={"/billing"}>
            <Button
              variant={"outline"}
              size={"sm"}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors gap-2"
            >
              <CreditCard className="w-4 h-4 text-Blac" />
              <span className=" hidden sm:inline text-Black">Billing</span>
            </Button>
          </Link>
        </Show>

        <UserButton />

        <Show when="signed-in">
          <SignOutButton>
            <Button
              variant={"outline"}
              size={"sm"}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors gap-2"
            >
              <LogOut className="w-4 h-4 text-Black" />
              <span className=" hidden sm:inline text-Black">Sign Out</span>
            </Button>
          </SignOutButton>
        </Show>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button
              variant={"outline"}
              size={"sm"}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors gap-2"
            >
              Sign In
            </Button>
          </SignInButton>
              </Show>
              
              <Show when="signed-out">
            <SignUpButton mode="modal">
                <Button
                variant={"outline"}
                size={"sm"}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors gap-2"
                >
                Sign Up
                </Button>
            </SignUpButton>
            </Show>
      </div>
    </nav>
  );
};
export default Navigation;
