import React, { useEffect } from 'react'
import StatsCard from '../components/StatsCard'
import VulnerableDriversTable from '../components/VulnerableDriversTable'
import RiskAnalysis from '../components/RiskAnalysis'
import Card from '../components/Card'

export default function Dashboard() {
  useEffect(() => {
    document.title = 'DriverShield - Dashboard'
  }, [])

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Dashboard</p>
        <div className="flex gap-3 overflow-x-auto">
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-4 pr-2">
            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Last 30 Days</p>
            <span className="material-symbols-outlined text-gray-500">arrow_drop_down</span>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-4 pr-2">
            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">By Region</p>
            <span className="material-symbols-outlined text-gray-500">arrow_drop_down</span>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-4 pr-2">
            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">By Risk Level</p>
            <span className="material-symbols-outlined text-gray-500">arrow_drop_down</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <StatsCard title="Total Drivers Monitored" value="1,482" delta="+1.5%" deltaType="up" />
        <StatsCard title="Active High-Risk Alerts" value="31" delta="+8.2%" deltaType="up" />
        <StatsCard title="Average Fleet Score" value="82/100" delta="-2.1%" deltaType="down" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
          <Card>
            <VulnerableDriversTable />
          </Card>
        </div>
        <Card>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Détection de Distraction &amp; Fatigue</h3>
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#D9534F" strokeWidth="3"></path>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#F0AD4E" strokeDasharray="60, 100" strokeWidth="3"></path>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#28A7C5" strokeDasharray="25, 100" strokeWidth="3"></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">12</span>
              <span className="text-sm text-gray-500">Events</span>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-alert-red"></div>Phone Use</span>
              <span className="font-semibold">6</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warning-amber"></div>Drowsiness</span>
              <span className="font-semibold">4</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-info-teal"></div>Inattention</span>
              <span className="font-semibold">2</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="rounded-xl p-6 bg-white dark:bg-[#0A2A4E] border border-gray-200 dark:border-gray-700 mt-6">
        <RiskAnalysis />
      </div>
    </div>
  )
}
