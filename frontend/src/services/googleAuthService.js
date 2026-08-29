const resolveBackendUrl = () => {
  const configured = import.meta.env.VITE_GOOGLE_AUTH_URL || import.meta.env.BACKEND_URL || 'http://localhost:8080';
  return configured.replace(/\/$/, '');
};

export function startGoogleAuth(mode = 'login') {
  const backendUrl = resolveBackendUrl();
  const googleAuthUrl = `${backendUrl}/api/auth/google`;

  if (typeof window !== 'undefined') {
    window.location.href = googleAuthUrl;
  }

  return { ok: true, redirectUrl: googleAuthUrl, mode };
}
