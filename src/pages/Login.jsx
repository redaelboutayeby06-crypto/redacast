import { useState } from 'react'
import { useAuth } from '../firebase/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) throw error
        setError('Check your email to confirm your account!')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        navigate('/app')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Glow */}
      <div style={{ position: 'fixed', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)', top: -200, left: '50%', transform: 'translateX(-50%)', zIndex: 0, borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', marginBottom: '32px', zIndex: 1 }}>
        <span style={{ color: '#fff', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.03em' }}>Reda<span style={{ color: '#6366f1' }}>cast</span></span>
      </Link>

      <div style={{ position: 'relative', zIndex: 1, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', marginBottom: '8px', textAlign: 'center', letterSpacing: '-0.02em' }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>
          {isSignUp ? 'Start generating voiceovers for free' : 'Sign in to Redacast'}
        </p>

        {error && (
          <div style={{ background: error.includes('Check') ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${error.includes('Check') ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: error.includes('Check') ? '#86efac' : '#fca5a5', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#888', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
              style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '13px 14px', color: '#ddd', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ color: '#888', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '13px 14px', color: '#ddd', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#1a1a2e' : '#6366f1', border: 'none', borderRadius: '10px', padding: '14px', color: loading ? '#444' : '#fff', fontWeight: '700', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p style={{ color: '#555', textAlign: 'center', marginTop: '20px', fontSize: '14px', marginBottom: 0 }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => { setIsSignUp(!isSignUp); setError('') }} style={{ color: '#a5b4fc', cursor: 'pointer', fontWeight: '700' }}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
        <p style={{ color: '#333', fontSize: '12px', marginTop: '24px', zIndex: 1 }}>
          Or{' '}
          <Link to="/app" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>try free without signup →</Link>
        </p>
      </div>
    </div>
  )
}