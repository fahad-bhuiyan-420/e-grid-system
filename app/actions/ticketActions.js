"use server";
import { pool } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function getTicketsByEvent(eventId) {
  try {
    const query = `
      SELECT t.ticket_id, t.purchase_status, e.title as event_name, e.price, e.location
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      WHERE t.event_id = ? AND t.purchase_status = 'available'
    `;
    const [rows] = await pool.execute(query, [eventId]);
    return { success: true, data: rows };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function purchaseTicketWithPayment(ticketId, userId, amount) {
  const connection = await pool.getConnection(); // Get a connection for transaction
  try {
    await connection.beginTransaction();

    // 1. Update the ticket status
    const updateTicketQuery = `
      UPDATE tickets 
      SET purchase_status = 'unavailable', participant_id = ?, purchase_date = NOW() 
      WHERE ticket_id = ? AND purchase_status = 'available'
    `;
    const [ticketResult] = await connection.execute(updateTicketQuery, [userId, ticketId]);

    if (ticketResult.affectedRows === 0) {
      throw new Error("Ticket is no longer available.");
    }

    // 2. Create the payment record
    // Generating a dummy transaction ID for now (e.g., TXN-123456)
    const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const paymentQuery = `
      INSERT INTO payments (amount, payment_status, transaction_id, ticket_id)
      VALUES (?, 'completed', ?, ?)
    `;
    await connection.execute(paymentQuery, [amount, transactionId, ticketId]);

    await connection.commit();
    revalidatePath("/events");
    return { success: true, transactionId };

  } catch (error) {
    await connection.rollback();
    console.error("Payment Transaction Error:", error);
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
}

export async function getPurchasedTickets(userId) {
  try {
    if (!userId) return { success: false, error: "User ID required" };

    const query = `
      SELECT 
        t.ticket_id, 
        t.purchase_status, 
        t.quantity, 
        DATE_FORMAT(t.purchase_date, '%M %d, %Y') as purchase_date,
        e.title as event_title, 
        e.location, 
        DATE_FORMAT(e.event_time, '%M %d, %Y at %h:%i %p') as event_date
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      WHERE t.participant_id = ?
      ORDER BY t.purchase_date DESC
    `;

    const [rows] = await pool.execute(query, [userId]);
    return { success: true, data: rows };
  } catch (error) {
    console.error("Fetch Tickets Error:", error);
    return { success: false, error: "Could not retrieve tickets" };
  }
}