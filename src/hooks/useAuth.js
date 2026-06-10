// Stub for Phase 1 — always authenticated.
// Phase 4 replaces this with a localStorage password check (v1)
// or Firebase Auth Google SSO (v2). The rest of the app never changes.
export function useAuth() {
  return { isAuthenticated: true }
}
