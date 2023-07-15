import NextAuth, { NextAuthOptions } from "next-auth";

// import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../adapters/mongoDbAdapter";

const { NEXTAUTH_SECRET = "", FACEBOOK_ID = "", FACEBOOK_SECRET = "", GOOGLE_ID = "", GOOGLE_SECRET = "" } = process.env;

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  //@ts-ignore
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/login",
  },
  providers: [
    // FacebookProvider({
    //   clientId: FACEBOOK_ID,
    //   clientSecret: FACEBOOK_SECRET,
    // }),
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, user }: { session: any; user: any }): Promise<any> => {
      if (user.team) {
        session.user = { ...session.user, team: user.team, role: user.team };
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
