/**
 * Extract display name from email
 * Examples:
 * - nicolas_balbontin@trimble.com -> Nicolas
 * - john.doe@example.com -> John
 * - jane@example.com -> Jane
 */
export function extractNameFromEmail(email: string): string {
  const localPart = email.split('@')[0];
  const namePart = localPart.split(/[._-]/)[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
}

/**
 * Generate a random avatar URL using DiceBear API
 * This provides consistent avatars based on the email
 */
export function generateAvatarUrl(email: string): string {
  const seed = encodeURIComponent(email);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

/**
 * Calculate session expiry (6 months from now)
 */
export function getSessionExpiry(): Date {
  const now = new Date();
  now.setMonth(now.getMonth() + 6);
  return now;
}

/**
 * Check if session is still valid (within 6 months)
 */
export function isSessionValid(lastLoginDate: Date): boolean {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return lastLoginDate > sixMonthsAgo;
}
