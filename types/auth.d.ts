import { DefaultSession, DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  email?: string;
  teamId?: string;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
