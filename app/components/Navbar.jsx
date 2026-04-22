"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md border-b border-gray-100">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 tracking-tight">
        <Link href="/">E-GRID</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
          Dashboard
        </Link>

        {status === "authenticated" ? (
          <div className="flex items-center gap-5 border-l pl-5 border-gray-200">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-bold">Welcome</p>
              <p className="text-sm font-semibold text-gray-800">{session.user?.name}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}