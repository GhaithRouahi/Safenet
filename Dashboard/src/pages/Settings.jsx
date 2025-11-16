import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import FormField from '../components/FormField'

export default function Settings() {
  useEffect(() => {
    document.title = 'DriverShield - Settings'
  }, [])

  const [fullName, setFullName] = useState('Admin User')
  const [email, setEmail] = useState('admin@insurance.co')
  const [language, setLanguage] = useState('English (United States)')
  const [alertsOn, setAlertsOn] = useState(true)

  return (
    <div>
      <h1 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.03em]">Settings</h1>
      <div className="mt-4 text-sm text-gray-600">Update profile, theme, language and notification preferences.</div>

      <div className="p-6 space-y-8 mt-6">
        <Card title="Admin Profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField id="fullName" label="Full Name">
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input mt-0 w-full rounded-lg bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary text-gray-900 dark:text-white" id="fullName" type="text" />
            </FormField>
            <FormField id="email" label="Email Address">
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-input mt-0 w-full rounded-lg bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary text-gray-900 dark:text-white" id="email" type="email" />
            </FormField>
            <div>
              <FormField id="password" label="Password">
                <button className="flex w-full justify-center items-center h-10 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800/50">Change Password</button>
              </FormField>
            </div>
            <div className="flex items-end">
              <button className="flex h-10 w-full items-center justify-center gap-x-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">Save Changes</button>
            </div>
          </div>
        </Card>

        <Card title="Theme Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className="border-2 border-primary rounded-xl p-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary">Light Mode</h3>
                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">White background with potential red accents.</p>
            </button>
            <button className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl p-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Dark blue background with potential red accents.</p>
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Language Settings">
            <FormField id="language" label="Select Language">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="form-select mt-0 w-full rounded-lg bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary text-gray-900 dark:text-white" id="language">
                <option>English (United States)</option>
                <option>Español (España)</option>
                <option>Français (France)</option>
                <option>Deutsch (Deutschland)</option>
              </select>
            </FormField>
          </Card>
          <Card title="Data &amp; Privacy">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-800 dark:text-gray-200">Data Retention Policy</p>
              <button className="text-sm text-primary font-medium">View Policy</button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="font-medium text-gray-800 dark:text-gray-200">Export User Data</p>
              <button className="text-sm text-primary font-medium">Request Export</button>
            </div>
          </Card>
        </div>

        <Card title="Notification Preferences">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">High-Risk Driver Alerts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified for severe driving incidents.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input checked={alertsOn} onChange={(e) => setAlertsOn(e.target.checked)} className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Weekly Summary Reports</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive a summary of driver performance every Monday.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input checked className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Policy Update Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when client policies are about to expire.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
