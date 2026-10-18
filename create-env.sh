#!/usr/bin/env bash
cat > public/env.js <<EOF
window._env = {
  NEXT_PUBLIC_SITE_URL: "${NEXT_PUBLIC_SITE_URL:-https://sweeps-hub.vercel.app}",
  NEXT_PUBLIC_SUPABASE_URL: "${NEXT_PUBLIC_SUPABASE_URL:-https://YOUR_PROJECT_REF.supabase.co}",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-YOUR_SUPABASE_ANON_KEY}"
};
EOF
