import { createClient } from '@supabase/supabase-js'
import { CojourneyRuntime } from '../lib/runtime'
import { TEST_EMAIL, TEST_PASSWORD, SUPABASE_URL, SUPABASE_ANON_KEY } from './constants'

export async function createRuntime (env: Record<string, string>, recentMessageCount = 12) {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

  // login
  const {
    data: { user, session }
  } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL!,
    password: TEST_PASSWORD!
  })

  if (!session) {
    throw new Error('Session not found')
  }

  const runtime = new CojourneyRuntime({
    debugMode: false,
    serverUrl: 'https://api.openai.com/v1',
    supabase,
    recentMessageCount,
    token: env.OPENAI_API_KEY!
  })

  return { user, session, runtime }
}
