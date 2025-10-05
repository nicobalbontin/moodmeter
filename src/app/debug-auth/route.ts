import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current auth settings
    const { data: { session } } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser()
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        nodeEnv: process.env.NODE_ENV,
      },
      auth: {
        hasSession: !!session,
        hasUser: !!user,
        sessionExpiry: session?.expires_at,
        userEmail: user?.email,
      },
      urls: {
        currentOrigin: 'http://localhost:3000',
        callbackUrl: 'http://localhost:3000/auth/callback',
      }
    }
    
    console.log('🔍 Auth Debug Info:', JSON.stringify(debugInfo, null, 2))
    
    return NextResponse.json(debugInfo, { status: 200 })
  } catch (error) {
    console.error('❌ Debug endpoint error:', error)
    return NextResponse.json({ error: 'Debug failed', details: error }, { status: 500 })
  }
}
