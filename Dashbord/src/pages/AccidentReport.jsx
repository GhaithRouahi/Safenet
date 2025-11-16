import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'

export default function AccidentReport() {
  useEffect(() => {
    document.title = 'DriverShield - Accident Report'
  }, [])

  const navigate = useNavigate()

  return (
    <div>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/drivers')} aria-label="Back to drivers" className="flex items-center justify-center size-10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <p className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.03em]">Accident Report</p>
          <p className="text-gray-500 dark:text-gray-400">Driver: John Doe - Report #ACC987654</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card title="Incident Summary">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Date &amp; Time</p>
                <p className="font-medium mt-1">Oct 26, 2023, 3:15 PM</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Location</p>
                <p className="font-medium mt-1">Elm St &amp; 5th Ave</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Weather</p>
                <p className="font-medium mt-1">Light Rain</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Speed at Impact</p>
                <p className="font-medium mt-1 text-alert-red flex items-center gap-1.5"><span className="material-symbols-outlined text-base">speed</span>35 mph</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Posted Speed Limit</p>
                <p className="font-medium mt-1">25 mph</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Impact Force</p>
                <p className="font-medium mt-1 text-alert-red flex items-center gap-1.5"><span className="material-symbols-outlined text-base">bolt</span>4.2 G (Severe)</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white p-6">Events Timeline (Pre-Incident)</h3>
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-6 relative">
                <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex items-start gap-4 relative">
                  <div className="flex items-center justify-center size-8 rounded-full bg-info-teal/20 text-info-teal z-10 ring-4 ring-white dark:ring-[#0A2A4E]"><span className="material-symbols-outlined text-base">route</span></div>
                  <div>
                    <p className="font-medium">Trip Start</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">3:05 PM - Trip initiated from 123 Main St.</p>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 ml-auto shrink-0">-10 min</p>
                </div>
                <div className="flex items-start gap-4 relative">
                  <div className="flex items-center justify-center size-8 rounded-full bg-warning-amber/20 text-warning-amber z-10 ring-4 ring-white dark:ring-[#0A2A4E]"><span className="material-symbols-outlined text-base">phone_iphone</span></div>
                  <div>
                    <p className="font-medium text-warning-amber">Distracted Driving Alert</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone use detected for 15 seconds while moving.</p>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 ml-auto shrink-0">-3 min</p>
                </div>
                <div className="flex items-start gap-4 relative">
                  <div className="flex items-center justify-center size-8 rounded-full bg-alert-red/20 text-alert-red z-10 ring-4 ring-white dark:ring-[#0A2A4E]"><span className="material-symbols-outlined text-base">speed</span></div>
                  <div>
                    <p className="font-medium text-alert-red">Excessive Speeding Alert</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle speed reached 40 mph in a 25 mph zone.</p>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 ml-auto shrink-0">-1 min</p>
                </div>
                <div className="flex items-start gap-4 relative">
                  <div className="flex items-center justify-center size-8 rounded-full bg-alert-red/20 text-alert-red z-10 ring-4 ring-white dark:ring-[#0A2A4E]"><span className="material-symbols-outlined text-base">emergency</span></div>
                  <div>
                    <p className="font-medium text-alert-red">Hard Braking Event</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sudden deceleration of 0.8g detected just before impact.</p>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 ml-auto shrink-0">-5 sec</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card title="Post-Incident Notifications">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center size-10 rounded-full bg-alert-red/20 text-alert-red mt-1"><span className="material-symbols-outlined">car_crash</span></div>
                <div>
                  <p className="font-medium">Automatic Crash Detection</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3:15:02 PM - Severe impact detected.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center size-10 rounded-full bg-info-teal/20 text-info-teal mt-1"><span className="material-symbols-outlined">call</span></div>
                <div>
                  <p className="font-medium">Emergency Services Contacted</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3:15:10 PM - Operator dispatched emergency response.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center size-10 rounded-full bg-success-green/20 text-success-green mt-1"><span className="material-symbols-outlined">upload_file</span></div>
                <div>
                  <p className="font-medium">Accident Data Uploaded</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3:16:30 PM - Vehicle data successfully sent to servers.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Vehicle Diagnostics">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300">Airbags Deployed:</p>
                <span className="font-semibold text-alert-red flex items-center gap-2"><span className="material-symbols-outlined text-base">check_circle</span> Yes (Driver, Passenger)</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300">Engine Status:</p>
                <span className="font-semibold text-gray-900 dark:text-white">Stalled</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300">Tire Pressure:</p>
                <span className="font-semibold text-success-green flex items-center gap-2"><span className="material-symbols-outlined text-base">check_circle</span> All Normal</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300">Seatbelt Status:</p>
                <span className="font-semibold text-success-green flex items-center gap-2"><span className="material-symbols-outlined text-base">check_circle</span> Driver Belted</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
