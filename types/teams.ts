interface Team {
  id?: string;
  _id?: string;
  name: string;
  invitedEmails?: string[];
  admins: string[];
  users: string[];
}
