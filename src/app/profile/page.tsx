import { createClient } from '~/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  // First check if session exists (for redirect purposes)
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  // Get the authenticated user data (secure way)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Now fetch the profile using the verified user ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      {/* Display other user info */}
      <p>Username: {profile?.username}</p>
      <p>Bio: {profile?.bio}</p>
      <p>Created at: {profile?.created_at}</p>
    </div>
  )
}