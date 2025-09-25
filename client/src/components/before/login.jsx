import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const pageStyle = {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: "linear-gradient(rgba(11,16,32,0.65), rgba(15,23,42,0.9)), url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1920&auto=format&fit=crop')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '24px'
  }

  const cardStyle = {
    width: '100%',
    maxWidth: '380px',
    backgroundColor: '#111827',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '22px',
    color: '#e5e7eb',
    boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
  }

  const titleStyle = {
    margin: 0,
    marginBottom: '18px',
    fontSize: '22px',
    color: '#ffffff'
  }

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '14px'
  }

  const inputStyle = {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #374151',
    backgroundColor: '#0b1020',
    color: '#e5e7eb',
    outline: 'none'
  }

  const buttonStyle = {
    marginTop: '6px',
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: '#22c55e',
    color: '#0b1020',
    fontWeight: 700,
    cursor: 'pointer'
  }

  const hintStyle = {
    fontSize: '12px',
    color: '#fca5a5',
    marginTop: '-6px'
  }

  const inputRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  const toggleStyle = {
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid #374151',
    backgroundColor: '#0b1020',
    color: '#9ca3af',
    cursor: 'pointer'
  }

  const isEmailValid = useMemo(() => /.+@.+\..+/.test(email), [email])
  const isPasswordValid = useMemo(() => password.length >= 6, [password])
  const isFormValid = isEmailValid && isPasswordValid

  async function handleSubmit(event) {
    event.preventDefault()
    setTouched({ email: true, password: true })
    if (!isFormValid) return

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      navigate('/home')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={pageStyle}>
      <form style={cardStyle} onSubmit={handleSubmit}>
        <h2 style={titleStyle}>Log in to MoodTunes</h2>
        {error && <p style={{ color: '#f87171', marginBottom: '8px' }}>{error}</p>}

        <label style={fieldStyle}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="you@example.com"
            style={inputStyle}
            required
          />
          {touched.email && !isEmailValid && <span style={hintStyle}>Enter a valid email.</span>}
        </label>

        <label style={fieldStyle}>
          <span>Password</span>
          <div style={inputRowStyle}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              placeholder="••••••••"
              style={{ ...inputStyle, flex: 1 }}
              required
            />
            <button type="button" style={toggleStyle} onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {touched.password && !isPasswordValid && <span style={hintStyle}>Must be at least 6 characters.</span>}
        </label>

        <button type="submit" style={buttonStyle} disabled={!isFormValid}>Log in</button>

        <div style={{ marginTop: '12px', fontSize: '14px', color: '#9ca3af' }}>
          Don&apos;t have an account? <Link to="/signup" style={{ color: '#93c5fd' }}>Sign up</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
