interface Team {
  id?: string;
  _id?: string;
  name?: string | undefined;
  invitedEmails?: (string | undefined)[] | null | undefined;
  admins?: (string | undefined)[] | null | undefined;
  users?: (string | undefined)[] | null | undefined;
}
