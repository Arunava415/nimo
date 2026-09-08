import * as Crypto from 'expo-crypto';

/**
 * The account PIN never leaves the device and is never stored in the clear.
 * We keep a random salt plus a SHA-256 digest of `salt:pin`.
 *
 * This is deliberately simple: NIMO has no server and no network calls, so the
 * threat model is "someone else picks up the same shared phone", not a remote
 * attacker with the database.
 */

export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

export function makeSalt(): string {
  const bytes = Crypto.getRandomBytes(16);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);
}

export async function verifyPin(pin: string, salt: string, expected: string): Promise<boolean> {
  const actual = await hashPin(pin, salt);
  return actual === expected;
}
