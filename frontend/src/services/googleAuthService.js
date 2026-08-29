const resolveBackendUrl = () => {
  const configured =
    import.meta.env.VITE_GOOGLE_AUTH_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080';

  const backendUrl = configured.replace(/\/$/, '');

  console.log('🔵 Google Auth - Backend URL:', backendUrl);

  return backendUrl;
};

export function startGoogleAuth(mode = 'login') {
  console.log('\n🚀 GOOGLE AUTH START');
  console.log('🔐 Mode:', mode);

  try {
    const backendUrl = resolveBackendUrl();

    const clientUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:5174';

    console.log('🌐 Frontend URL:', clientUrl);

    const googleAuthUrl =
      `${backendUrl}/api/auth/google` +
      `?client_url=${encodeURIComponent(clientUrl)}`;

    console.log('🔗 Generated Google Auth URL:');
    console.log(googleAuthUrl);

    if (typeof window !== 'undefined') {
      console.log('➡️ Redirecting browser to backend...');
      console.log('➡️ Target:', googleAuthUrl);

      window.location.href = googleAuthUrl;
    }

    return {
      ok: true,
      redirectUrl: googleAuthUrl,
      mode,
    };
  } catch (error) {
    console.error('❌ GOOGLE AUTH START FAILED');
    console.error(error);

    return {
      ok: false,
      redirectUrl: null,
      mode,
      error,
    };
  }
}