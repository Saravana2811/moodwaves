
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BeforeSignIn from './components/before/before.jsx'
import Login from './components/before/login.jsx'
import SignUp from './components/before/signup.jsx'
import Home from './components/after/home.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BeforeSignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
