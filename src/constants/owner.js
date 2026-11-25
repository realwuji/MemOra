/*
  The owner of the site. Their account is marked "Owner" on their dashboard profile.
  This is a label for the person looking at their own dashboard, not a permission: nothing
  in the app is unlocked by it.
*/
export const OWNER_EMAILS = ['mudassirwork63@gmail.com']

export const isOwner = (email) => Boolean(email) && OWNER_EMAILS.includes(String(email).trim().toLowerCase())
