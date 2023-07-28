import { useState } from 'react'
import logo from '/static/logo.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtocolList from './Pages/ProtocolList/ProtocolList';
// import BlocklyPage from 'Pages/Blockly/Blockly';
import LauchPage from './Pages/LaunchPage/LaunchPage';
import Login from 'Pages/Login/Login';
import Constructor from 'Pages/Constructor/Constructor';
import Settings from 'Pages/Settings/Settings';
import Preparation from './Pages/LaunchPreparation/Preparations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list" element={<ProtocolList />} />
        <Route path="/test" element={<h1>TEST</h1>} />
        <Route path="/create/protocol/:id" element={<Constructor />} />
        <Route path="/prepare/:id" element={<Preparation />} />
        <Route path="/start/:id" element={<LauchPage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}

function TestComp() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
