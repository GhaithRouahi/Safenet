import React from 'react'

export default function ReportCard({ children, highlight }) {
  return (
    <div className={`flex flex-col gap-2 rounded-xl p-4 ${highlight ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-[#0A2A4E]'} border border-gray-200 dark:border-gray-700`}>
      {children}
    </div>
  )
}
