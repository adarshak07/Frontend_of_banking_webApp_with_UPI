import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const onboarding = searchParams.get('onboarding');
    const redirect = searchParams.get('redirect');
    
    console.log('🔄 OAuthSuccess: URL params - token:', token ? token.substring(0, 50) + '...' : 'null', 'onboarding:', onboarding, 'redirect:', redirect);

    if (token) {
      console.log('🔄 OAuthSuccess: Token found, calling login...');
      // Store the token and log in
      login(token).then(() => {
        console.log('🔄 OAuthSuccess: Login successful, redirecting...');
        // Redirect based on whether this is a new user or redirect parameter
        if (onboarding === 'true') {
          console.log('🔄 OAuthSuccess: Redirecting to onboarding');
          navigate('/onboarding');
        } else if (redirect === 'home') {
          console.log('🔄 OAuthSuccess: Redirecting to homepage');
          navigate('/');
        } else {
          console.log('🔄 OAuthSuccess: Redirecting to dashboard');
          navigate('/dashboard');
        }
      }).catch((error) => {
        console.error('🔄 OAuthSuccess: OAuth login failed:', error);
        navigate('/login?error=oauth_failed');
      });
    } else {
      console.log('🔄 OAuthSuccess: No token found, redirecting to login');
      // No token, redirect to login
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="card" style={{ maxWidth: 400, margin: "100px auto", padding: "2rem", textAlign: "center" }}>
      <h2>Completing OAuth Login...</h2>
      <p>Please wait while we complete your authentication.</p>
      <div style={{ marginTop: "1rem" }}>
        <div className="spinner"></div>
      </div>
    </div>
  );
}
