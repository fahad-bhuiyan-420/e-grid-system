"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPurchasedTickets } from "../../actions/ticketActions";


export default function PurchaseTicket() {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      if (status === "authenticated" && session?.user?.id) {
        const result = await getPurchasedTickets(session.user.id);
        if (result.success) {
          setTickets(result.data);
        } else {
          console.error(result.error);
        }
        setLoading(false);
      } else if (status === "unauthenticated") {
        setLoading(false);
      }
    }
    loadTickets();
  }, [status, session]);

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <div className="p-10 text-center">Please log in to view your tickets.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Tickets</h1>
        <p className="text-gray-500">View and manage your event entries.</p>
      </div>

      {tickets.length === 0 ? (
        <div className="card bg-base-100 shadow-md border p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="text-xl font-medium text-gray-400">You haven't purchased any tickets yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.ticket_id} className="card card-side bg-base-100 shadow-xl border border-base-300 overflow-hidden">
              {/* Ticket "Stump" (The Left Side) */}
              <div className="bg-primary text-primary-content p-6 flex flex-col justify-center items-center w-32 border-r-2 border-dashed border-base-300">
                <span className="text-xs uppercase font-bold opacity-70">Quantity</span>
                <span className="text-4xl font-black">{ticket.quantity}</span>
              </div>

              {/* Main Ticket Info */}
              <div className="card-body p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-2xl text-blue-700 uppercase tracking-tight">
                      {ticket.event_title}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-sm font-medium">{ticket.location}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{ticket.event_date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`badge badge-md font-bold uppercase ${
                      ticket.purchase_status === 'purchased' ? 'badge-success text-white' : 'badge-ghost'
                    }`}>
                      {ticket.purchase_status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase">Order ID: #{ticket.ticket_id}</p>
                  </div>
                </div>
                
                <div className="divider my-2"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Purchased on: {ticket.purchase_date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}