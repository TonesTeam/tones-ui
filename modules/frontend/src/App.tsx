import { useState } from 'react'
import logo from 'static/logo.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtocolList from './ProtocolList/ProtocolList';
import History from 'History/History';
import BlocklyPage from 'Blockly/Blockly';
import Recommendations from './Reccomendations/Recommendations';

// import {NavBarItem} from 'navbar/NavigationBar'

import Login from 'Login/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtocolList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list" element={<ProtocolList />} />
        <Route path="/history" element={<History />} />
        <Route path="/test" element={<h1>TEST</h1>} />
        <Route path="/edit/protocol/:id" element={<BlocklyPage />} />
        <Route path="/create/protocol" element={<BlocklyPage />} />
        <Route path="/launch/:id" element={<Recommendations />} />
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
