"use server";

import { pool } from "@/app/lib/db";
import { revalidatePath } from "next/cache";


export async function createEventDirectly(formData) {
  try {
    // 1. Get the userId from the formData object
    const userId = formData.get("userId");

    const title = formData.get("title");
    const description = formData.get("description");
    const time = formData.get("time");
    const location = formData.get("location");
    const price = parseFloat(formData.get("price")) || 0;
    const category = formData.get("category");

    // 2. Validation check
    if (!userId) {
      return { success: false, error: "Missing User ID. Submission blocked." };
    }

    // 3. Execute SQL
    const query = `
            INSERT INTO events (title, description, event_time, location, price, category, status, user_id)
            VALUES (?, ?, ?, ?, ?, ?, 'approved', ?)
        `;

    await pool.execute(query, [
      title,
      description,
      time,
      location,
      price,
      category,
      userId // This is the ID passed from the frontend
    ]);

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

// Add this to your existing eventActions.js
export async function deleteEvent(id, userId) {
  try {
    const query = "DELETE FROM events WHERE id = ? AND user_id = ?";
    await pool.execute(query, [id, userId]);
    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }
}