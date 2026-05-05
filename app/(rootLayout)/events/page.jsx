"use client";

import React, { useState, useEffect } from "react";
import { getAllEvents } from "@/app/actions/eventActions";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch events whenever search term changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const result = await getAllEvents(search);
      if (result.success) {
        setEvents(result.data);
      }
      setLoading(false);
    };

    // Debounce search to prevent too many DB calls
    const delayDebounceFn = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Navbar></Navbar>
      {/* Header & Search Bar Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Discover Events
          </h1>
          <p className="text-gray-500 mt-2">Explore the best tech summits, concerts, and workshops.</p>
        </div>

        <div className="form-control w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, category, or description..."
              className="input input-bordered w-full pl-10 focus:border-primary shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <span className="badge badge-primary badge-outline text-xs font-bold uppercase">
                    {event.category}
                  </span>
                  <span className="text-lg font-bold text-success">
                    {Number(event.price) === 0 ? "FREE" : `৳${event.price}`}
                  </span>
                </div>

                <h2 className="card-title text-xl mt-2 line-clamp-1">{event.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 mt-2">{event.description}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {event.date}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {event.location}
                  </div>
                </div>

                <div className="card-actions justify-end mt-6">
                  <Link href={`/events/${event.id}`} className="btn btn-primary btn-block">
                    Get Tickets
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && events.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-400">No events found matching "{search}"</h3>
          <button onClick={() => setSearch("")} className="btn btn-ghost btn-sm mt-2 text-primary">Clear search</button>
        </div>
      )}
    </div>
  );
}