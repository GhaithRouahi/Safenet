import React from 'react'

export default function FormField({ id, label, children }) {
  return (
    <div>
      {label && <label className="text-sm font-medium text-gray-600 dark:text-gray-400" htmlFor={id}>{label}</label>}
      <div className="mt-2">{children}</div>
    </div>
  )
}
