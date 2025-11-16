import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import ReportCard from '../components/ReportCard'

export default function MonthlyReport() {
  useEffect(() => {
    document.title = 'DriverShield - Monthly Report'
  }, [])

  const navigate = useNavigate()

  return (
    <div>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/drivers')} aria-label="Back to drivers" className="flex items-center justify-center size-10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <p className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.03em]">John Doe's Monthly Report</p>
          <p className="text-gray-500 dark:text-gray-400">October 1 - October 31, 2023</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card title="Monthly Driving Summary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <ReportCard highlight>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Avg. Speed</p>
                <p className="text-gray-900 dark:text-white text-2xl font-bold">42 <span className="text-base font-normal">mph</span></p>
                <p className="text-success-green font-medium flex items-center gap-1"><span className="material-symbols-outlined text-base">arrow_downward</span>-5% from last month</p>
              </ReportCard>
              <ReportCard highlight>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Avg. Braking Force</p>
                <p className="text-gray-900 dark:text-white text-2xl font-bold">0.32 <span className="text-base font-normal">G</span></p>
                <p className="text-success-green font-medium flex items-center gap-1"><span className="material-symbols-outlined text-base">arrow_downward</span>-10% from last month</p>
              </ReportCard>
              <ReportCard highlight>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Avg. Cornering</p>
                <p className="text-gray-900 dark:text-white text-2xl font-bold">0.25 <span className="text-base font-normal">G</span></p>
                <p className="text-success-green font-medium flex items-center gap-1"><span className="material-symbols-outlined text-base">arrow_downward</span>Improved</p>
              </ReportCard>
            </div>
          </Card>
        </div>
        <ReportCard>
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="stroke-current text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
              <path className="stroke-current text-success-green" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" strokeDasharray="88, 100" strokeWidth="3"></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">88</span>
              <span className="text-sm text-gray-500">/ 100</span>
            </div>
          </div>
          <p className="font-semibold mt-2 text-lg">Monthly Safety Score</p>
          <p className="text-sm text-success-green font-medium">Excellent</p>
        </ReportCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#0A2A4E] border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">SafeNet Model Detections</p>
          <p className="text-gray-900 dark:text-white text-2xl font-bold">38</p>
          <p className="text-gray-500 text-sm font-medium">Total events logged this month</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#0A2A4E] border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">True Positives</p>
          <p className="text-gray-900 dark:text-white text-2xl font-bold">35</p>
          <p className="text-success-green text-sm font-medium flex items-center gap-1"><span className="material-symbols-outlined text-base">verified</span>92% Accuracy</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#0A2A4E] border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">False Positives</p>
          <p className="text-gray-900 dark:text-white text-2xl font-bold">3</p>
          <p className="text-warning-amber text-sm font-medium flex items-center gap-1"><span className="material-symbols-outlined text-base">report</span>8% Error Rate</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#0A2A4E] border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Risk Events</p>
          <p className="text-gray-900 dark:text-white text-2xl font-bold">2</p>
          <p className="text-alert-red text-sm font-medium flex items-center gap-1"><span className="material-symbols-outlined text-base">dangerous</span>Required review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#0A2A4E] border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personalized Tips &amp; Advice</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center size-8 rounded-full bg-success-green/20 text-success-green mt-1"><span className="material-symbols-outlined text-base">local_gas_station</span></div>
              <div>
                <p className="font-medium">Maintain Smooth Acceleration</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gentle acceleration improves fuel efficiency. You've done a great job this month!</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center size-8 rounded-full bg-info-teal/20 text-info-teal mt-1"><span className="material-symbols-outlined text-base">tire_repair</span></div>
              <div>
                <p className="font-medium">Check Tire Pressure</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">With winter approaching, ensure your tires are properly inflated for better grip in wet conditions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center size-8 rounded-full bg-warning-amber/20 text-warning-amber mt-1"><span className="material-symbols-outlined text-base">light_mode</span></div>
              <div>
                <p className="font-medium">Mindful Night Driving</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Continue to be extra cautious during night drives. Remember to use your high beams on empty roads.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary mt-1"><span className="material-symbols-outlined text-base">oil_barrel</span></div>
              <div>
                <p className="font-medium">Upcoming Maintenance</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your vehicle is due for an oil change in the next 500 miles. Schedule a service soon!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#0A2A4E] border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">How You Compare</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">Safety Score vs. Average</p>
              <div className="flex items-center gap-2">
                <span className="text-success-green font-semibold">Top 15%</span>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-success-green h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Speeding Events vs. Average</p>
              <div className="flex items-center gap-2">
                <span className="text-success-green font-semibold">Below Avg</span>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-success-green h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Hard Braking vs. Average</p>
              <span className="font-semibold text-gray-600 dark:text-gray-300">On Par</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Miles Driven This Month</p>
              <span className="font-semibold text-gray-600 dark:text-gray-300">890 miles</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Most Active Day</p>
              <span className="font-semibold text-gray-600 dark:text-gray-300">Wednesday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
