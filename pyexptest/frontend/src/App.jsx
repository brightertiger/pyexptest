import { Routes, Route, NavLink } from 'react-router-dom'
import SampleSizeCalculator from './pages/SampleSizeCalculator'
import ConfidenceIntervalCalculator from './pages/PowerCalculator'
import SignificanceCalculator from './pages/SignificanceCalculator'

function App() {
  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="pyexptest" className="sidebar-logo" />
        </div>
        
        <div className="nav-section">
          <div className="nav-section-title">Tools</div>
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            <span className="nav-icon">📐</span>
            Sample Size
          </NavLink>
          <NavLink 
            to="/analyze" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            Analyze Results
          </NavLink>
          <NavLink 
            to="/confidence" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📏</span>
            Confidence Interval
          </NavLink>
        </div>
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<SampleSizeCalculator />} />
          <Route path="/analyze" element={<SignificanceCalculator />} />
          <Route path="/confidence" element={<ConfidenceIntervalCalculator />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
