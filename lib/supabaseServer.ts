import { createClient } from "@supabase/supabase-js";

// ใช้ Service Role Key เท่านั้น ไม่ต้อง NEXT_PUBLIC_
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);