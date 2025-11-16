import React from 'react'

export default function StatsCard({ title, value, delta, deltaType = 'up' }) {
  const deltaClass = deltaType === 'up' ? 'text-success-green' : 'text-alert-red'
  const icon = deltaType === 'up' ? 'arrow_upward' : 'arrow_downward'

  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#0A2A4E] border border-gray-200 dark:border-gray-700">
      <p className="text-gray-600 dark:text-gray-300 text-base font-medium leading-normal">{title}</p>
      <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">{value}</p>
      {delta ? (
        <p className={`${deltaClass} text-base font-medium leading-normal flex items-center gap-1`}>
          <span className="material-symbols-outlined text-lg">{icon}</span>
          {delta}
        </p>
      ) : null}
    </div>
  )
}
