import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import AiLabPage from './pages/AiLabPage.jsx'
import LearnPage from './pages/LearnPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import AgentTestPage from './pages/AgentTestPage.jsx'
import AnalyzeModePage from './pages/AnalyzeModePage.jsx'

function App() {
  return (
    <div className="app">
      <div className="mesh" aria-hidden="true" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lab" element={<AiLabPage />} />
        <Route path="/leren" element={<LearnPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/agent-test" element={<AgentTestPage />} />
        <Route path="/analyze-mode" element={<AnalyzeModePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
