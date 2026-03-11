import { useState } from 'react'
import { useAuth } from '../firebase/AuthContext'
import { useNavigate } from 'react-router-dom'

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
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#00e5ff', fontSize: '24px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '32px' }}>
          {isSignUp ? 'Start cloning your voice for free' : 'Sign in to VoiceClone AI'}
        </p>

        {error && (
          <div style={{ background: error.includes('Check') ? '#0a2a0a' : '#2a0a0a', border: `1px solid ${error.includes('Check') ? '#00ff00' : '#ff0000'}`, borderRadius: '8px', padding: '12px', marginBottom: '20px', color: error.includes('Check') ? '#00ff00' : '#ff6666', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #00e5ff, #b8ff57)', border: 'none', borderRadius: '8px', padding: '14px', color: '#000', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p style={{ color: '#666', textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            style={{ color: '#00e5ff', cursor: 'pointer' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  )
}