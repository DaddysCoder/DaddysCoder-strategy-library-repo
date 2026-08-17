import { type FormEvent, useEffect, useState } from 'react'
import { saveProfile, usePractitioner } from '../lib/practitioner'

export function Settings() {
  const practitioner = usePractitioner()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    if (practitioner) {
      setName(practitioner.name)
      setRole(practitioner.role)
    }
  }, [practitioner])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await saveProfile(name.trim(), role.trim())
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-xl font-display font-bold text-[#111111] dark:text-white">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Your name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Role
          <input
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-4 py-2 text-sm font-semibold"
        >
          Save
        </button>
      </form>
      <p className="text-xs text-slate-500">
        All data stays on this device. There is no account sync or central server in Phase 1.
      </p>
    </div>
  )
}
