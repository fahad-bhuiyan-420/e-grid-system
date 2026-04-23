"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  console.log(session?.user?.id, status);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <p className="text-gray-600">Your event management stats go here.</p>
      
      {/* Example Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

      </div>
    </div>
  );
}