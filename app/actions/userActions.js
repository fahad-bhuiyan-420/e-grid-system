"use server";

import { pool } from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// Ensure this function name matches EXACTLY what you import in register/page.tsx
export async function registerUser(formData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Using the correct column names from your database
    await pool.execute(
      "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, 'user']
    );

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    if (error.code === 'ER_DUP_ENTRY') return { success: false, error: "Email already exists" };
    return { success: false, error: "Database error during registration" };
  }
}

export async function getUsers() {
  try {
    // CONCAT helps bridge the gap between DB (first_name/last_name) and UI (name)
    const [rows] = await pool.execute(
      `SELECT id, CONCAT(first_name, ' ', last_name) AS name, email, role, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(rows)) 
    };
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function updateUserRole(userId, newRole) {
    try {

        const query = "UPDATE users SET role = ? WHERE id = ?";
        
        // Try using pool.execute directly first (matches your getUsers logic)
        await pool.execute(query, [newRole, userId]);

        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        console.error("Update Role Error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteUser(userId) {
    try {
        const query = "DELETE FROM users WHERE id = ?";
        await pool.execute(query, [userId]);

        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        console.error("Delete User Error:", error);
        return { success: false, error: error.message };
    }
}