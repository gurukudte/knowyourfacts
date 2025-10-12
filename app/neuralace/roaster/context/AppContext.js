'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [volunteers, setVolunteers] = useState([])
  const [shifts, setShifts] = useState([])
  const [weekSettings, setWeekSettings] = useState({
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    weekOffDays: ['Saturday', 'Sunday']
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedVolunteers = localStorage.getItem('shift-roster-volunteers')
    const savedShifts = localStorage.getItem('shift-roster-shifts')
    const savedWeekSettings = localStorage.getItem('shift-roster-weekSettings')

    if (savedVolunteers) setVolunteers(JSON.parse(savedVolunteers))
    if (savedShifts) setShifts(JSON.parse(savedShifts))
    if (savedWeekSettings) setWeekSettings(JSON.parse(savedWeekSettings))
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shift-roster-volunteers', JSON.stringify(volunteers))
  }, [volunteers])

  useEffect(() => {
    localStorage.setItem('shift-roster-shifts', JSON.stringify(shifts))
  }, [shifts])

  useEffect(() => {
    localStorage.setItem('shift-roster-weekSettings', JSON.stringify(weekSettings))
  }, [weekSettings])

  const addVolunteer = (volunteer) => {
    setVolunteers(prev => [...prev, { ...volunteer, id: Date.now() + Math.random() }])
  }

  const updateVolunteer = (id, updatedVolunteer) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...updatedVolunteer, id } : v))
  }

  const removeVolunteer = (id) => {
    setVolunteers(prev => prev.filter(v => v.id !== id))
  }

  const bulkAddVolunteers = (newVolunteers) => {
    setVolunteers(prev => [...prev, ...newVolunteers])
  }

  const addShift = (shift) => {
    setShifts(prev => [...prev, { ...shift, id: Date.now() + Math.random() }])
  }

  const removeShift = (id) => {
    setShifts(prev => prev.filter(s => s.id !== id))
  }

  const updateWeekSettings = (newSettings) => {
    setWeekSettings(newSettings)
  }

  const value = {
    // State
    volunteers,
    shifts,
    weekSettings,

    // Volunteer actions
    addVolunteer,
    updateVolunteer,
    removeVolunteer,
    bulkAddVolunteers,
    setVolunteers,

    // Shift actions
    addShift,
    removeShift,
    setShifts,

    // Week settings actions
    updateWeekSettings,
    setWeekSettings
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}