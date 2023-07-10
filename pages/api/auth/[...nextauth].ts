import NextAuth, { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const {
  NEXTAUTH_SECRET = "",
  FACEBOOK_ID = "",
  FACEBOOK_SECRET = "",
  GOOGLE_ID = "",
  GOOGLE_SECRET = "",
} = process.env;

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    FacebookProvider({
      clientId: FACEBOOK_ID,
      clientSecret: FACEBOOK_SECRET,
    }),
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    CredentialsProvider({
      id: "guest",
      name: "Guest",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        return { id: 0, name: "Gast", email: "gast@scherbes.de" };
      },
    }),
  ],
};

export default NextAuth(authOptions);
