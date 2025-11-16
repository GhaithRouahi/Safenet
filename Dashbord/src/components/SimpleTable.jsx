import React from 'react'

export default function SimpleTable({ columns = [], rows = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 dark:bg-white/5">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{c.header}</th>
            ))}
            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((r, idx) => (
            <tr key={idx}>
              {columns.map((c, i) => (
                <td key={i} className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.render ? c.render(r) : r[c.key]}</td>
              ))}
              <td className="p-4 whitespace-nowrap text-right">
                {rows[idx].actions}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
