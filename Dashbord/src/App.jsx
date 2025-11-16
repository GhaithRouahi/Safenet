import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Drivers from './pages/Drivers'
import Reports from './pages/Reports'
import AccidentReport from './pages/AccidentReport'
import MonthlyReport from './pages/MonthlyReport'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/accident" element={<AccidentReport />} />
        <Route path="/reports/monthly" element={<MonthlyReport />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}
