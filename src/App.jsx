import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import EntryForm from './pages/EntryForm'

const App = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-entry" element={<EntryForm />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px'
          },
          success: { iconTheme: { primary: '#1B4332', secondary: '#fff' } },
          error: { iconTheme: { primary: '#6B0F0F', secondary: '#fff' } }
        }}
      />
    </div>
  )
}

export default App
