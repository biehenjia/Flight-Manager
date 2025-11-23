import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function GoogleAuthButton() {
  const auth = useAuth()
  if (!auth) return null
  const { user, signIn, signOut, loading } = auth

  if (loading) return <div>Auth loading…</div>

  if (user) {
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{user.displayName || user.email}</div>
          <div style={{ fontSize: 12 }}>{user.email}</div>
        </div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return <button onClick={() => signIn()}>Sign in with Google</button>
}
