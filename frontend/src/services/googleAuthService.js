const resolveBackendUrl = () => {
  const configured = import.meta.env.VITE_GOOGLE_AUTH_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080';
  return configured.replace(/\/$/, '');
};

export function startGoogleAuth(mode = 'login') {
  const backendUrl = resolveBackendUrl();
  const clientUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174';
  const googleAuthUrl = `${backendUrl}/api/auth/google?client_url=${encodeURIComponent(clientUrl)}`;

  if (typeof window !== 'undefined') {
    window.location.href = googleAuthUrl;
  }

  return { ok: true, redirectUrl: googleAuthUrl, mode };
}
