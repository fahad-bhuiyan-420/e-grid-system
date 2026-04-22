import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool } from "@/app/lib/db";

const handler = NextAuth({
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
                    const [rows]: any = await pool.execute(
                        "SELECT * FROM users WHERE email = ?",
                        [credentials.email]
                    );

                    const user = rows[0];

                    if (user && await bcrypt.compare(credentials.password, user.password)) {
                        return {
                            id: user.id.toString(),
                            name: `${user.first_name} ${user.last_name}`,
                            email: user.email,
                            role: user.role, // 1. Added role here so it's available to callbacks
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
    // 2. Added Callbacks to persist the role in the session
    callbacks: {
        async jwt({ token, user }) {
            // When user logs in, 'user' exists and we move role to 'token'
            if (user) {
                token.role = (user as any).role; 
            }
            return token;
        },
        async session({ session, token }) {
            // Move the role from 'token' to 'session.user'
            if (session.user) {
                (session.user as any).role = token.role;
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
});

export { handler as GET, handler as POST };