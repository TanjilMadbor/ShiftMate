function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return bufferToHex(bytes.buffer);
}

export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(digest);
}
