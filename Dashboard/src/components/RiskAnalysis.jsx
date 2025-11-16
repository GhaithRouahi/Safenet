import React from 'react'

export default function RiskAnalysis() {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Analyse Comportementale &amp; Score de Risque</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="stroke-current text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
              <path className="stroke-current text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" strokeDasharray="78, 100" strokeWidth="3"></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">78</span>
              <span className="text-sm text-gray-500">/ 100</span>
            </div>
          </div>
          <p className="font-semibold mt-2">Overall Driver Score</p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Speeding Incidents</span>
              <span className="text-gray-500 dark:text-gray-400">12</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-warning-amber h-2.5 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Hard Braking</span>
              <span className="text-gray-500 dark:text-gray-400">8</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-alert-red h-2.5 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Sharp Cornering</span>
              <span className="text-gray-500 dark:text-gray-400">5</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-info-teal h-2.5 rounded-full" style={{ width: '30%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
