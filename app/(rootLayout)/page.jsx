"use client";
// import Navbar from "./components/Navbar";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";


export default function Home() {

    const {data: session, status} = useSession();
    console.log(session, status);
  return (
    <main className="min-h-screen bg-white">
      <Navbar></Navbar>
      
      {/* Hero Section */}
      <section className="relative py-20 px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-600 uppercase bg-blue-100 rounded-full">
            Digital Event Management System
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Connect, Organize, and <br />
            <span className="text-blue-600 font-black">Participate Effortlessly.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            E-Grid is a comprehensive platform built for Group 10. From browsing events to 
            managing registrations, we provide the tools organizers and attendees need.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/events" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-xl hover:-translate-y-1">
              Find all Events
            </Link>

          </div>
        </div>
      </section>

      {/* Feature Section (Matches your Schema requirements) */}
      <section className="max-w-6xl mx-auto px-8 py-20 border-t border-gray-50">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
            <h3 className="text-xl font-bold text-gray-900">For Participants</h3>
            <p className="text-gray-600 leading-relaxed">
              Browse listed events, search for specifics, and add them to your <strong>Wishlist</strong> to receive notifications.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xl">2</div>
            <h3 className="text-xl font-bold text-gray-900">For Organizers</h3>
            <p className="text-gray-600 leading-relaxed">
              Create events, track ticket sales, and send real-time updates to your registered users.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xl">3</div>
            <h3 className="text-xl font-bold text-gray-900">Admin Control</h3>
            <p className="text-gray-600 leading-relaxed">
              Full oversight to approve organizers and moderate events for a secure community.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-400 text-sm border-t border-gray-50">
        © 2026 E-Grid System | Group 10 Section 01
      </footer>
    </main>
  );
}