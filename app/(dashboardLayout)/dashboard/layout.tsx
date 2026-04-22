"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Page Content Area */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-100 shadow-sm border-b border-base-300 px-4">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </label>
          </div>
          <div className="flex-1 px-2 font-bold text-blue-600">E-GRID DASHBOARD</div>
        </nav>

        {/* This is where your page content (CreateEvent or Stats) will appear */}
        <div className="p-8">
          {children}
        </div>
      </div>

      {/* Sidebar - Always stays here */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-base-100 text-base-content border-r border-base-300">
          <li className="mb-4 text-xl font-black text-blue-600 px-4">E-GRID</li>
          <li><Link href="/">Homepage</Link></li>
          <li><Link href="/dashboard">Dashboard Home</Link></li>


          {session?.user?.role === "organizer" && (

            <>
              <div className="text-xl mt-2">Organizer Pages</div>
              <li><Link href="/dashboard/createEvent">Create Event</Link></li>
              <li><Link href="/dashboard/events">Events</Link></li>
            </>
          )}


          {session?.user?.role === "admin" && (
            <>
              <div className="text-xl mt-2">Admin Pages</div>
              <li><Link href="/dashboard/manageUsers">Manage Users</Link></li>
            </>
          )

          }

          <li><a>Settings</a></li>
        </ul>
      </div>
    </div>
  );
}