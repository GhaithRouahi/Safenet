import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleTable from '../components/SimpleTable'

const sampleRows = [
  { client: 'John Doe', policy: 'POL987654', risk: 'High Risk', hasAccident: true },
  { client: 'Jane Smith', policy: 'POL123456', risk: 'Low Risk', hasAccident: false },
  { client: 'Mike Johnson', policy: 'POL789012', risk: 'Medium Risk', hasAccident: true },
  { client: 'Emily Davis', policy: 'POL345678', risk: 'Low Risk', hasAccident: false },
]

export default function Reports() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'DriverShield - Reports Overview'
  }, [])

  const columns = [
    { header: 'Client', key: 'client', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: "url('https://via.placeholder.com/48')" }}></div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{r.client}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{r.client.toLowerCase().replace(' ', '')}@example.com</p>
        </div>
      </div>
    ) },
    { header: 'Policy Number', key: 'policy' },
    { header: 'Risk Level', key: 'risk', render: (r) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r.risk === 'High Risk' ? 'bg-alert-red/10 text-alert-red' : r.risk === 'Low Risk' ? 'bg-success-green/10 text-success-green' : 'bg-warning-amber/10 text-warning-amber'}`}>{r.risk}</span>
    ) }
  ]

  const rows = sampleRows.map((r) => ({
    ...r,
    actions: (
      <div className="text-right">
        <button onClick={() => navigate('/reports/accident')} className={`inline-flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-md px-3 text-sm font-medium ${r.hasAccident ? 'border border-alert-red/50 bg-alert-red/10 text-alert-red' : 'border border-gray-300 dark:border-gray-600'}`}>
          <span className="material-symbols-outlined text-base">car_crash</span>
          <span>{r.hasAccident ? 'Accident Report' : 'No Accidents'}</span>
        </button>
        <button onClick={() => navigate('/reports/monthly')} className="inline-flex ml-2 h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-md border border-gray-300 dark:border-gray-600 px-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5">
          <span className="material-symbols-outlined text-base">calendar_month</span>
          <span>Monthly Report</span>
        </button>
      </div>
    )
  }))

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.03em]">Reports Overview</p>
          <p className="text-gray-500 dark:text-gray-400">Manage and view all client reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 bg-white dark:bg-navy hover:bg-gray-50 dark:hover:bg-white/5">
            <span className="material-symbols-outlined text-base">filter_list</span>
            <p className="text-sm font-medium leading-normal">Filter</p>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 bg-white dark:bg-navy hover:bg-gray-50 dark:hover:bg-white/5">
            <span className="material-symbols-outlined text-base">swap_vert</span>
            <p className="text-sm font-medium leading-normal">Sort</p>
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white dark:bg-[#0A2A4E] border border-gray-200 dark:border-gray-700 overflow-hidden mt-6">
        <SimpleTable columns={columns} rows={rows} />
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing 1 to {sampleRows.length} of {sampleRows.length} results</p>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center size-8 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50" disabled><span className="material-symbols-outlined text-base">chevron_left</span></button>
            <button className="inline-flex items-center justify-center size-8 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5"><span className="material-symbols-outlined text-base">chevron_right</span></button>
          </div>
        </div>
      </div>
    </div>
  )
}
