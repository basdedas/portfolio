import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // This secret encrypts the session so users stay logged in
  secret: process.env.NEXTAUTH_SECRET,
});

// NextAuth needs to handle both GET and POST requests
export { handler as GET, handler as POST };