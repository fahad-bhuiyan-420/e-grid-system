"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getEvents } from "@/app/actions/eventActions"; // Import your action
import { deleteEvent } from "../../../actions/eventActions";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    async function loadEvents() {
      const result = await getEvents();
      if (result.success) {
        setEvents(result.data);
      } else {
        console.error(result.error);
      }
      setLoading(false);
    }
    loadEvents();
  }, []);

  // 2. Handle Delete Function
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    // Optional: Optimistic UI update (remove from state immediately)
    const originalEvents = [...events];
    setEvents(events.filter(event => event.id !== id));

    const result = await deleteEvent(id);

    if (!result.success) {
      alert("Failed to delete: " + result.error);
      setEvents(originalEvents); // Rollback if error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Managed Events</h1>
          <p className="text-gray-500 text-sm">Track, edit, and manage your hosted gatherings.</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="font-bold text-gray-700">Event Details</th>
                <th className="font-bold text-gray-700 text-center">Price</th>
                <th className="font-bold text-gray-700 text-center">Status</th>
                <th className="font-bold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-base-200/50 transition-colors">
                  <td>
                    <div className="flex flex-col">
                      <span className="font-bold text-blue-600 uppercase tracking-tight">{event.title}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {event.location}
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5">{event.date}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="badge badge-ghost font-medium">
                      {/* Convert to number just in case DB returns string */}
                      {Number(event.price) === 0 ? "Free" : `৳ ${event.price}`}
                    </div>
                  </td>
                  <td className="text-center">
                    <span className={`badge badge-sm font-bold uppercase tracking-wider p-3 ${event.status === "approved" ? "badge-success text-white" : "badge-warning"
                      }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="join">
                      <button onClick={() => handleDelete(event.id)} className="btn btn-sm join-item btn-ghost text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {events.length === 0 && (
          <div className="p-10 text-center text-gray-400 font-medium">
            No events found in the database.
          </div>
        )}
      </div>
    </div>
  );
}