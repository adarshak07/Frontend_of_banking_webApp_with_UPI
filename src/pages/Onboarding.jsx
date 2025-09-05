import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Onboarding() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('http://localhost:8082/auth/me');
      setUserInfo(response.data);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const steps = [
    {
      icon: "🎉",
      title: "Welcome to MyBank!",
      description: "Your account has been successfully created with Google SSO",
      color: "#10b981"
    },
    {
      icon: "🔐",
      title: "Secure & Verified",
      description: "Your email is verified and your account is ready to use",
      color: "#3b82f6"
    },
    {
      icon: "💳",
      title: "Banking Features",
      description: "Access all our modern banking features and services",
      color: "#8b5cf6"
    }
  ];

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 2rem'
          }}></div>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '0.5rem'
          }}>
            Setting Up Your Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Please wait while we prepare everything for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%',
        animation: 'slideUp 0.6s ease-out'
      }}>
        {/* Progress Steps */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            {steps.map((step, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: index <= currentStep ? step.color : '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    width: '40px',
                    height: '2px',
                    background: index < currentStep ? step.color : '#e5e7eb',
                    margin: '0 0.5rem',
                    transition: 'all 0.3s ease'
                  }}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: `linear-gradient(135deg, ${steps[currentStep].color}, ${steps[currentStep].color}dd)`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: `0 15px 30px ${steps[currentStep].color}40`,
            fontSize: '3rem',
            animation: 'pulse 2s infinite'
          }}>
            {steps[currentStep].icon}
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#1e293b',
            marginBottom: '0.5rem',
            background: `linear-gradient(135deg, ${steps[currentStep].color}, ${steps[currentStep].color}dd)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {steps[currentStep].title}
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '1.2rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {steps[currentStep].description}
          </p>
        </div>

        {/* Account Details Card */}
        {userInfo && currentStep >= 1 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', 
            padding: '2rem', 
            borderRadius: '16px', 
            marginBottom: '2rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '1.5rem', 
              color: '#1e293b',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              Your Account Details
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>Name:</span>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{userInfo.name}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>Email:</span>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{userInfo.email}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>Account Type:</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>Savings Account</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>Initial Balance:</span>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>₹0.00</span>
              </div>
            </div>
          </div>
        )}

        {/* Features Card */}
        {currentStep >= 2 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', 
            padding: '2rem', 
            borderRadius: '16px', 
            marginBottom: '2rem',
            border: '1px solid #bfdbfe',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.1)'
          }}>
            <h4 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '1rem', 
              color: '#1e40af',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              🚀 What's Next?
            </h4>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[
                'Complete your profile setup',
                'Add funds to your account',
                'Set up UPI for easy payments',
                'Explore our banking features',
                'Enable notifications for security'
              ].map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '8px',
                  color: '#1e40af',
                  fontWeight: '500'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>✨</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {currentStep < steps.length - 1 ? (
            <button 
              onClick={() => setCurrentStep(currentStep + 1)}
              style={{ 
                flex: 1,
                padding: '1rem', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                background: `linear-gradient(135deg, ${steps[currentStep].color}, ${steps[currentStep].color}dd)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 10px 20px ${steps[currentStep].color}40`
              }}
            >
              Next Step →
            </button>
          ) : (
            <button 
              onClick={handleContinue}
              style={{ 
                flex: 1,
                padding: '1rem', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)'
              }}
            >
              🎉 Continue to Dashboard
            </button>
          )}
        </div>

        {/* Skip Option */}
        {currentStep < steps.length - 1 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={handleContinue}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textDecoration: 'underline'
              }}
            >
              Skip and go to Dashboard
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
