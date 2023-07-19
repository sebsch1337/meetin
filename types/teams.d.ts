interface Team {
  id?: string;
  _id?: string;
  name?: string | undefined;
  invitedEmails?: InvitedEmails[] | null | undefined;
  admins?: (string | undefined)[] | null | undefined;
  users?: (string | undefined)[] | null | undefined;
}

interface InvitedEmails {
  email: string;
  role: string;
}
