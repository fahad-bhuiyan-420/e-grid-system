"use server";

import { pool } from "@/app/lib/db"; // Import your existing pool
import { revalidatePath } from "next/cache";

export async function createEventDirectly(formData) {
  // 1. Extract values
  const title = formData.get("title");
  const description = formData.get("description");
  const time = formData.get("time");
  const location = formData.get("location");
  const price = formData.get("price");
  const category = formData.get("category");

  try {
    // 2. The SQL Query
    // We use 'approved' to bypass the admin check as requested
    const query = `
      INSERT INTO events (title, description, event_time, location, price, category, status)
      VALUES (?, ?, ?, ?, ?, ?, 'approved')
    `;
    
    // 3. Execute using the pool
    await pool.execute(query, [
      title, 
      description, 
      time, 
      location, 
      price, 
      category
    ]);
    
    // 4. Clear cache so the 'My Events' page updates immediately
    revalidatePath("/dashboard/events"); 
    
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: error.message };
  }
  // No need for connection.end() when using a pool!
}

// Action to fetch events for your table
export async function getEvents() {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, description, DATE_FORMAT(event_time, '%Y-%m-%d %h:%i %p') as date, location, price, status FROM events ORDER BY created_at DESC"
    );
    return { success: true, data: rows };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, error: "Could not retrieve events" };
  }
}

// Add this to your existing eventActions.js
export async function deleteEvent(id) {
  try {
    const query = "DELETE FROM events WHERE id = ?";
    await pool.execute(query, [id]);
    
    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }
}