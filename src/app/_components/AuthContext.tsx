'use client'
import type { Session, User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "~/utils/supabase/client"

// 1. Create the context
type AuthContextType = {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

// 2. Create a hook to use the context
export const useAuth = () => useContext(AuthContext)

// 3. Create the provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const verifyUser = async (session: Session | null) => {
    try {
      if (session) {
        // Always use getUser to get authenticated user data
        const { data: { user: verifiedUser }, error } = await supabase.auth.getUser()
        if (error) {
          console.error("Auth verification error:", error)
          setUser(null)
        } else {
          setUser(verifiedUser)
        }
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error("Auth verification exception:", err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    
    const fetchUser = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession()
        
        // Only update if component is still mounted
        if (mounted) {
          await verifyUser(session)
        }
      } catch (err) {
        console.error("Session fetch error:", err)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }
    
    fetchUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          await verifyUser(session)
        }
      }
    )
  
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // 4. Use the context's Provider component here
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}