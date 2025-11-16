import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Layout({ children }) {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen w-full">
      <aside className="app-sidebar flex w-64 flex-col bg-white dark:bg-[#0A2A4E] text-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-white p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="size-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path></svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">SafeNet</h2>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="flex flex-col gap-2">
            <NavLink to="/dashboard" className={({ isActive }) => `text-left w-full flex items-center gap-3 rounded-lg px-3 py-2 ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/10'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </NavLink>
            <NavLink to="/drivers" className={({ isActive }) => `text-left w-full flex items-center gap-3 rounded-lg px-3 py-2 ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/10'}`}>
              <span className="material-symbols-outlined">group</span>
              <p className="text-sm font-medium leading-normal">Drivers</p>
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `text-left w-full flex items-center gap-3 rounded-lg px-3 py-2 ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/10'}`}>
              <span className="material-symbols-outlined">bar_chart</span>
              <p className="text-sm font-medium leading-normal">Reports</p>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `text-left w-full flex items-center gap-3 rounded-lg px-3 py-2 ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/10'}`}>
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </NavLink>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5sZaL-lCTlfnr45WHgTSJGTl4T4ZsjRBPEBb8y7AETDq1io1Umf1Sk1kY1ga9undwNA1ClYCpLeeufyLzZtxSUALcG8ZxkzWR6HwmcikBWue2fdk4tDyV1Sf_G0SjA0eNea2E9E_8kI60GZ9BsZsjJUGBhKSS4WX3qbYaQ1aKzdR2x9TBrBWdm2bLlhFtvftEaZWcgYXMSo9fkNQxtybuMcB-QMz9-V5Ms0RoRPU90eLWZLenfD03b53glxC6KsoV6nd-AlgAArpZ")'}}></div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">Admin User</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">admin@insurance.co</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-y-auto main-surface">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 bg-surface px-6 py-3 sticky top-0 z-10">
          <label className="flex flex-col min-w-40 w-full max-w-sm">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
              <div className="text-gray-500 dark:text-gray-400 flex bg-gray-100 dark:bg-gray-800/50 items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-100 dark:bg-gray-800/50 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search drivers, policies..." />
            </div>
          </label>
          <div className="flex items-center gap-4">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            <div className="hidden lg:flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-4">
              <span className="material-symbols-outlined">add</span>
              <span>New Report</span>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
