import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawAllowed = env.PREVIEW_ALLOWED_HOSTS?.trim();

  let allowedHosts: true | string[] | undefined;
  if (rawAllowed === 'true' || rawAllowed === '*') {
    allowedHosts = true; // allow any host (useful for Cloud Run URLs that can vary)
  } else if (rawAllowed) {
    allowedHosts = rawAllowed
      .split(',')
      .map((host) => host.trim())
      .filter(Boolean);
  } else {
    // Default to allowing any host to avoid blocked-host errors on dynamic Cloud Run domains
    allowedHosts = true;
  }

  return {
    plugins: [react()],
    server: {
      port: 5173
    },
    preview: {
      host: true,
      port: 8080,
      allowedHosts
    },
    build: {
      outDir: 'dist'
    }
  };
});
