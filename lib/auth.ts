export function adminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSCODE ||
      process.env.NODE_ENV !== "production",
  );
}

export function expectedAdminKey(): string {
  return (
    process.env.ADMIN_PASSCODE ||
    (process.env.NODE_ENV !== "production" ? "adzu-admin" : "")
  );
}

export function isAdmin(request: Request): boolean {
  const expected = expectedAdminKey();
  if (!expected) return false;
  const provided = request.headers.get("x-admin-key") ?? "";
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
}
