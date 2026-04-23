// app/lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool } from "@/app/lib/db";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const [rows] = await pool.execute(
                        "SELECT * FROM users WHERE email = ?",
                        [credentials.email]
                    );

                    const user = rows[0];

                    if (user && await bcrypt.compare(credentials.password, user.password)) {
                        return {
                            id: user.id.toString(),
                            name: `${user.first_name} ${user.last_name}`,
                            email: user.email,
                            role: user.role,
                        };
                    }
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Store ID in token
                token.role = user.role; 
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id; // Move ID to session
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};