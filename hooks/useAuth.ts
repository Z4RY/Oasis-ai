"use client"

import { useState, useEffect } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    // Update profile with display name if provided
    if (displayName && result.user) {
      await updateProfile(result.user, {
        displayName: displayName,
      })
    }

    return result
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result
    } catch (error: any) {
      // Handle specific Google Auth errors
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in was cancelled")
      } else if (error.code === "auth/popup-blocked") {
        throw new Error("Popup was blocked by browser")
      } else {
        throw new Error("Google sign-in failed")
      }
    }
  }

  const logout = async () => {
    return signOut(auth)
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  }
}
