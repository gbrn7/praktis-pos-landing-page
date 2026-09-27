import { revalidatePath } from 'next/cache';

export function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Invariant: static generation store missing when invoked outside request context
  }
}
