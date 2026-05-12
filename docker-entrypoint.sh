#!/bin/sh
# Generate runtime config from environment variables
cat > /usr/share/nginx/html/config.js <<EOF
window.__CONFIG__ = {
  SUPABASE_URL: "${SUPABASE_URL}",
  SUPABASE_ANON_KEY: "${SUPABASE_ANON_KEY}",
  AUTH_PROVIDER: "${AUTH_PROVIDER:-email}",
};
EOF

exec nginx -g 'daemon off;'
