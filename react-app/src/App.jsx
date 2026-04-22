import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import LearnPage from './pages/LearnPage.jsx'
import ContactPage from './pages/ContactPage.jsx'

function App() {
  return (
    <div className="app">
      <div className="mesh" aria-hidden="true" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/leren" element={<LearnPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
