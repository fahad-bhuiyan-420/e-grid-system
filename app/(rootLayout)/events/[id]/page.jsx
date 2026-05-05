"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getTicketsByEvent, purchaseTicketWithPayment } from "@/app/actions/ticketActions";

export default function EventTicketsPage() {
    const { id } = useParams(); // Gets the event ID from the URL
    const { data: session } = useSession();
    const router = useRouter();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            const result = await getTicketsByEvent(id);
            if (result.success) setTickets(result.data);
            setLoading(false);
        };
        fetchTickets();
    }, [id]);

    const handlePurchase = async (ticket) => {
        if (!session) {
            alert("Please log in first!");
            return;
        }

        const confirmPurchase = window.confirm(`Confirm payment of ৳${ticket.price}?`);
        if (!confirmPurchase) return;

        // Use the new action that handles both ticket update and payment entry
        const res = await purchaseTicketWithPayment(
            ticket.ticket_id,
            session.user.id,
            ticket.price
        );

        if (res.success) {
            alert(`Payment Successful! Transaction ID: ${res.transactionId}`);
            router.refresh();
            setTickets(tickets.filter(t => t.ticket_id !== ticket.ticket_id));
        } else {
            alert("Payment failed: " + res.error);
        }
    };

    if (loading) return <div className="text-center p-20"><span className="loading loading-spinner"></span></div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button onClick={() => router.back()} className="btn btn-ghost mb-4">← Back to Events</button>

            <div className="bg-base-200 p-8 rounded-2xl mb-8">
                <h1 className="text-3xl font-bold">{tickets[0]?.event_name || "Event Tickets"}</h1>
                <p className="text-gray-500 mt-2">Available Tickets: {tickets.length}</p>
            </div>

            <div className="space-y-4">
                {tickets.map((ticket, index) => (
                    <div key={ticket.ticket_id} className="collapse collapse-arrow bg-base-100 border border-base-300">
                        <input type="radio" name="my-accordion-2" defaultChecked={index === 0} />
                        <div className="collapse-title text-xl font-medium flex justify-between items-center">
                            <span>Ticket #{index + 1}</span>
                            <span className="text-primary font-bold">৳{ticket.price}</span>
                        </div>
                        <div className="collapse-content">
                            <p className="text-sm text-gray-500 mb-4">Location: {ticket.location}</p>
                            <button
                                onClick={() => handlePurchase(ticket)} // Pass the whole ticket object
                                className="btn btn-primary btn-block"
                            >
                                Purchase Now (৳{ticket.price})
                            </button>
                        </div>
                    </div>
                ))}

                {tickets.length === 0 && (
                    <div className="alert alert-error">
                        <span>Sold out! No tickets available for this event.</span>
                    </div>
                )}
            </div>
        </div>
    );
}