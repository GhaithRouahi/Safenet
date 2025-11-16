import React, { useEffect, useState } from 'react'
import StatsCard from '../components/StatsCard'
import Card from '../components/Card'
import ReportCard from '../components/ReportCard'

export default function Drivers() {
  useEffect(() => {
    document.title = 'DriverShield - Driver Details'
  }, [])

  const sampleDrivers = [
    { id: 'john_doe', name: 'John Doe', policy: 'POL123456789', email: 'john.doe@example.com', category: 'Elderly', vehicle: 'Old Car', lastTrip: '2h ago', miles: '12,450 mi', score: 65, scoreLabel: 'High Risk', avgRpm: '3,500', braking: '0.45 G', cornering: '0.38 G', speedingEvents: 12, history: ['No accidents reported in the last 24 months. 1 minor fender-bender reported on 03/15/2021.'] },
    { id: 'jane_smith', name: 'Jane Smith', policy: 'POL987654321', email: 'jane.smith@example.com', category: 'Adult', vehicle: 'Sedan', lastTrip: '1d ago', miles: '8,230 mi', score: 88, scoreLabel: 'Low Risk', avgRpm: '2,900', braking: '0.32 G', cornering: '0.25 G', speedingEvents: 2, history: ['No accidents reported.'] },
    { id: 'mike_johnson', name: 'Mike Johnson', policy: 'POL555666', email: 'mike.j@example.com', category: 'Young Adult', vehicle: 'Truck', lastTrip: '3h ago', miles: '20,100 mi', score: 72, scoreLabel: 'Medium Risk', avgRpm: '3,800', braking: '0.50 G', cornering: '0.45 G', speedingEvents: 5, history: ['1 minor accident reported in 2022.'] }
  ]

  const [selected, setSelected] = useState(sampleDrivers[0])

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Left column: list of drivers */}
        <div className="lg:col-span-1">
          <Card title="Drivers">
            <div className="space-y-2">
              {sampleDrivers.map((d) => (
                <button key={d.id} onClick={() => setSelected(d)} className={`w-full text-left p-3 rounded-lg ${selected.id === d.id ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-white' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{d.policy}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main details and stats */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center size-10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                <p className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.03em]">{selected.name}</p>
                <p className="text-gray-500 dark:text-gray-400">Policy #{selected.policy}</p>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-surface border border-surface pl-4 pr-2">
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Last 30 Days</p>
                <span className="material-symbols-outlined text-gray-500">arrow_drop_down</span>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary text-white border border-primary/50 px-4">
                <span className="material-symbols-outlined text-base">download</span>
                <p className="text-sm font-medium leading-normal">Export Data</p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <Card title="Driver Profile">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium flex items-center gap-2 mt-1"><span className="material-symbols-outlined text-base text-warning-amber">elderly</span>{selected.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Vehicle</p>
                    <p className="font-medium flex items-center gap-2 mt-1"><span className="material-symbols-outlined text-base text-info-teal">directions_car</span>{selected.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Last Trip</p>
                    <p className="font-medium mt-1">{selected.lastTrip}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Miles</p>
                    <p className="font-medium mt-1">{selected.miles}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Driving History</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{selected.history.join(' ')}</p>
                </div>
              </Card>
            </div>

            <ReportCard>
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="stroke-current text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                  <path className="stroke-current text-alert-red" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" strokeDasharray="65, 100" strokeWidth="3"></path>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{selected.score}</span>
                  <span className="text-sm text-gray-500">/ 100</span>
                </div>
              </div>
              <p className="font-semibold mt-2 text-lg">Overall Risk Score</p>
              <p className="text-sm text-alert-red font-medium">{selected.scoreLabel}</p>
            </ReportCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="flex flex-col gap-2 rounded-xl p-4 bg-surface border border-surface">
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Avg. RPM</p>
              <p className="text-gray-900 dark:text-gray-100 text-2xl font-bold">{selected.avgRpm}</p>
              <p className="text-warning-amber text-sm font-medium flex items-center gap-1"><span className="material-symbols-outlined text-base">arrow_upward</span>Higher than avg.</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-4 bg-surface border border-surface">
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Avg. Braking Force</p>
              <p className="text-gray-900 dark:text-gray-100 text-2xl font-bold">{selected.braking}</p>
              <p className="text-success-green text-sm font-medium flex items-center gap-1"><span className="material-symbols-outlined text-base">arrow_downward</span>Within safe range</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-4 bg-surface border border-surface">
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Avg. Sharp Cornering</p>
              <p className="text-gray-900 dark:text-gray-100 text-2xl font-bold">{selected.cornering}</p>
              <p className="text-warning-amber text-sm font-medium flex items-center gap-1"><span className="material-symbols-outlined text-base">arrow_upward</span>Borderline aggressive</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-4 bg-surface border border-surface">
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Speeding Events</p>
              <p className="text-gray-900 dark:text-gray-100 text-2xl font-bold">{selected.speedingEvents}</p>
              <p className="text-alert-red text-sm font-medium flex items-center gap-1"><span className="material-symbols-outlined text-base">dangerous</span>Action required</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col gap-4 rounded-xl p-6 bg-surface border border-surface">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Alert Log</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-8 rounded-full bg-alert-red/20 text-alert-red mt-1"><span className="material-symbols-outlined text-base">speed</span></div>
                  <div>
                    <p className="font-medium">Excessive Speeding Detected</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">15 mph over limit on I-95. Today at 2:45 PM.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-8 rounded-full bg-warning-amber/20 text-warning-amber mt-1"><span className="material-symbols-outlined text-base">phone_iphone</span></div>
                  <div>
                    <p className="font-medium">Distracted Driving (Phone Use)</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone detected in hand for 25s. Yesterday at 9:12 AM.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-8 rounded-full bg-info-teal/20 text-info-teal mt-1"><span className="material-symbols-outlined text-base">airline_stops</span></div>
                  <div>
                    <p className="font-medium">Sharp Cornering</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">High G-force turn on Elm Street. 3 days ago at 6:30 PM.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-8 rounded-full bg-alert-red/20 text-alert-red mt-1"><span className="material-symbols-outlined text-base">emergency</span></div>
                  <div>
                    <p className="font-medium">Hard Braking Event</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sudden stop detected. 4 days ago at 8:05 AM.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl p-6 bg-surface border border-surface">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Additional Risk Factors</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Night Driving Frequency</p>
                  <div className="flex items-center gap-2">
                    <span className="text-warning-amber font-semibold">High</span>
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-warning-amber h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Urban vs Highway Driving</p>
                  <div className="flex items-center gap-2">
                    <span className="text-info-teal font-semibold">70% Urban</span>
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-info-teal h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Fatigue Alerts</p>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">2 events</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Unusual Route Deviation</p>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">1 instance</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Weather Condition Driving</p>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Frequent (Rain)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
