import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  children?: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Know Your Facts
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/explore" className="text-gray-600 hover:text-gray-900">
                Explore
              </Link>
              <Link href="/share" className="text-gray-600 hover:text-gray-900">
                Share
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
