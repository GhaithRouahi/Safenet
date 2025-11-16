import React from 'react'

export default function Card({ title, children, className = '' }) {
  return (
    <div className={`card rounded-xl p-6 bg-surface border border-gray-200 dark:border-gray-700 ${className}`}>
      {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>}
      {children}
    </div>
  )
}
