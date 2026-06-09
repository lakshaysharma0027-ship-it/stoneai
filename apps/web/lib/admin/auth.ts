export const isAdminEmail = (email: string | null | undefined) => {
  const admins = (process.env.STONEAI_ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(email && admins.includes(email.toLowerCase()));
};
