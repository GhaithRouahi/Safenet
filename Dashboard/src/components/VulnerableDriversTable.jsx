import React from 'react'

const sampleRows = [
  { name: 'John Doe', category: 'Elderly', status: 'At Risk', statusType: 'alert-red', last: '2h ago' },
  { name: 'Jane Smith', category: 'Medical Condition', status: 'Monitored', statusType: 'warning-amber', last: '5h ago' },
  { name: 'Emily White', category: 'New Driver', status: 'Safe', statusType: 'success-green', last: 'Yesterday' },
]

export default function VulnerableDriversTable({ rows = sampleRows }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Suivi des conducteurs vulnérables</h3>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Driver Name</th>
              <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Category</th>
              <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Alert Status</th>
              <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Last Trip</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i < rows.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}>
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-gray-600 dark:text-gray-300">{r.category}</td>
                <td className="p-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${r.statusType}/20 text-${r.statusType}`}>{r.status}</span></td>
                <td className="p-3 text-gray-600 dark:text-gray-300">{r.last}</td>
                <td className="p-3 text-right"><button className="text-primary font-medium text-sm">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
