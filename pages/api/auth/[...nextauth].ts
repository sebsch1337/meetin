import NextAuth, { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

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
  ],
};

export default NextAuth(authOptions);
