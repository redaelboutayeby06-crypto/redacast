import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pzkepvkrcjluwmtbghbm.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_mJCv49eLgTkvbyZk29WSIA_5eAn1mNt'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)