"use server";

import { pool } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function createEventDirectly(formData) {
  try {
    const userId = formData.get("userId");
    const title = formData.get("title");
    const description = formData.get("description");
    const time = formData.get("time");
    const location = formData.get("location");
    const price = parseFloat(formData.get("price")) || 0;
    const category = formData.get("category");

    if (!userId) {
      return { success: false, error: "Missing User ID. Submission blocked." };
    }

    // 1. Insert the Event
    const eventQuery = `
      INSERT INTO events (title, description, event_time, location, price, category, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?, 'approved', ?)
    `;

    const [eventResult] = await pool.execute(eventQuery, [
      title,
      description,
      time,
      location,
      price,
      category,
      userId
    ]);

    // 2. Get the newly created Event ID
    const newEventId = eventResult.insertId;

    // 3. Create 10 tickets for this event
    // We prepare a bulk insert query for performance
    const ticketValues = [];
    const placeholders = [];
    
    for (let i = 0; i < 10; i++) {
      // Each ticket row: purchase_status, quantity, purchase_date, event_id, participant_id
      // Note: ticket_id is usually an AUTO_INCREMENT primary key in SQL
      placeholders.push("(?, ?, NOW(), ?, ?)");
      ticketValues.push("available", 1, newEventId, userId);
    }

    const ticketQuery = `
      INSERT INTO tickets (purchase_status, quantity, purchase_date, event_id, participant_id)
      VALUES ${placeholders.join(", ")}
    `;

    await pool.execute(ticketQuery, ticketValues);

    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("SQL Error:", error);
    return { success: false, error: error.message };
  }
}


// Action to fetch events for your table
export async function getEvents(userId) {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    // Filter by user_id
    const query = `
      SELECT id, title, description, 
      DATE_FORMAT(event_time, '%Y-%m-%d %h:%i %p') as date, 
      location, price, status 
      FROM events 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(query, [userId]);

    return { success: true, data: rows };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, error: "Could not retrieve events" };
  }
}

export async function getAllEvents(searchQuery = "") {
  try {
    // We use % wildcard for the SQL LIKE operator
    const formattedSearch = `%${searchQuery}%`;
    
    const query = `
      SELECT id, title, description, 
      DATE_FORMAT(event_time, '%M %d, %Y at %h:%i %p') as date, 
      location, price, category 
      FROM events 
      WHERE status = 'approved' 
      AND (title LIKE ? OR description LIKE ? OR category LIKE ?)
      ORDER BY event_time ASC
    `;

    const [rows] = await pool.execute(query, [formattedSearch, formattedSearch, formattedSearch]);
    return { success: true, data: rows };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, error: "Could not retrieve events" };
  }
}

// Inside eventActions.js
export async function deleteEvent(id, userId) {
  try {
    // Check for undefined to prevent SQL driver errors
    if (!id || !userId) {
      throw new Error("Missing Event ID or User ID");
    }

    const query = "DELETE FROM events WHERE id = ? AND user_id = ?";
    const [result] = await pool.execute(query, [id, userId]);

    if (result.affectedRows === 0) {
      return { success: false, error: "Event not found or unauthorized." };
    }

    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }
}

