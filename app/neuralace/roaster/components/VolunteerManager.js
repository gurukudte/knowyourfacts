import { useState, useEffect } from 'react'
import { Plus, Upload, Download, Trash2, Edit, Search, Filter, X, Calendar } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'

export default function VolunteerManager() {
  const { volunteers, addVolunteer, removeVolunteer, bulkAddVolunteers, shifts } = useAppContext()
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    preferredShift: '',
    weekOffDays: []
  })
  const [bulkInput, setBulkInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [shiftFilter, setShiftFilter] = useState('all')
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [availableShifts, setAvailableShifts] = useState([])

  // Update available shifts when shifts context changes
  useEffect(() => {
    if (shifts && shifts.length > 0) {
      setAvailableShifts(shifts)
    }
  }, [shifts])

  // Filter volunteers based on search and filters
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.preferredShift.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesShift = shiftFilter === 'all' || volunteer.preferredShift === shiftFilter
    return matchesSearch && matchesShift
  })

  const handleAddVolunteer = () => {
    if (newVolunteer.name.trim()) {
      if (editingId) {
        // Update existing volunteer
        // You'll need to implement updateVolunteer in your context
        // updateVolunteer(editingId, newVolunteer)
        setEditingId(null)
      } else {
        addVolunteer({ ...newVolunteer, id: Date.now() + Math.random() })
      }
      setNewVolunteer({ name: '', preferredShift: '', weekOffDays: [] })
    }
  }

  const handleBulkImport = () => {
    const lines = bulkInput.split('\n').filter(line => line.trim())
    const newVolunteers = lines.map(line => {
      const [name, preferredShift, weekOffDays] = line.split(',').map(item => item.trim())
      return {
        id: Date.now() + Math.random(),
        name: name || '',
        preferredShift: preferredShift || '',
        weekOffDays: weekOffDays ? weekOffDays.split('/') : []
      }
    })
    bulkAddVolunteers(newVolunteers)
    setBulkInput('')
    setShowBulkImport(false)
  }

  const exportVolunteers = () => {
    const data = volunteers.map(v => `${v.name},${v.preferredShift},${v.weekOffDays.join('/')}`).join('\n')
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'volunteers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleWeekOffDay = (day) => {
    setNewVolunteer(prev => ({
      ...prev,
      weekOffDays: prev.weekOffDays.includes(day)
        ? prev.weekOffDays.filter(d => d !== day)
        : [...prev.weekOffDays, day]
    }))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewVolunteer({ name: '', preferredShift: '', weekOffDays: [] })
  }

  const getShiftDetails = (shiftName) => {
    return availableShifts.find(shift => shift.name === shiftName)
  }

  const getShiftColor = (shiftName) => {
    const shift = getShiftDetails(shiftName)
    return shift?.color || 'gray'
  }

  const getShiftTiming = (shiftName) => {
    const shift = getShiftDetails(shiftName)
    if (!shift) return ''
    return `${shift.startTime} - ${shift.endTime}`
  }

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="min-h-screen bg-gray-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Volunteer Management</h1>
              <p className="mt-2 text-gray-600">Manage your volunteers and their preferred shifts</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{availableShifts.length} shifts available</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Volunteer Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Volunteer Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? 'Edit Volunteer' : 'Add Volunteer'}
                </h2>
                {editingId && (
                  <button
                    onClick={cancelEdit}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter volunteer name"
                    value={newVolunteer.name}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Shift
                  </label>
                  <select
                    value={newVolunteer.preferredShift}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, preferredShift: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select a shift</option>
                    {availableShifts.map((shift) => (
                      <option key={shift.id} value={shift.name}>
                        {shift.name} ({shift.startTime} - {shift.endTime})
                      </option>
                    ))}
                  </select>
                  {availableShifts.length === 0 && (
                    <p className="text-sm text-amber-600 mt-2">
                      No shifts available. Please create shifts in Shift Manager first.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Week Off Days
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {weekDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWeekOffDay(day)}
                        className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                          newVolunteer.weekOffDays.includes(day)
                            ? 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddVolunteer}
                  disabled={!newVolunteer.name.trim()}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {editingId ? 'Update Volunteer' : 'Add Volunteer'}
                </button>
              </div>
            </div>

            {/* Shift Summary Card */}
            {availableShifts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift Summary</h3>
                <div className="space-y-3">
                  {availableShifts.map((shift) => {
                    const volunteersInShift = volunteers.filter(v => v.preferredShift === shift.name).length
                    return (
                      <div key={shift.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: shift.color }}
                          />
                          <div>
                            <div className="font-medium text-gray-900">{shift.name}</div>
                            <div className="text-sm text-gray-500">
                              {shift.startTime} - {shift.endTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{volunteersInShift}</div>
                          <div className="text-xs text-gray-500">volunteers</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowBulkImport(!showBulkImport)}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700">Bulk Import</span>
                  <Upload className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={exportVolunteers}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700">Export Data</span>
                  <Download className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Volunteers List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bulk Import Panel */}
            {showBulkImport && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Bulk Import</h3>
                  <button
                    onClick={() => setShowBulkImport(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Format:</strong> Name, Shift Name, Week Off Days (separated by /)<br/>
                    <strong>Available Shifts:</strong> {availableShifts.map(s => s.name).join(', ')}
                  </p>
                </div>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={`Example:\nJohn Doe,Morning Shift,Monday/Tuesday\nJane Smith,Evening Shift,Saturday/Sunday`}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {bulkInput.split('\n').filter(line => line.trim()).length} volunteers ready to import
                  </span>
                  <button
                    onClick={handleBulkImport}
                    disabled={!bulkInput.trim()}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Volunteers
                  </button>
                </div>
              </div>
            )}

            {/* Volunteers List Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Volunteers ({filteredVolunteers.length})
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Total volunteers: {volunteers.length}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search volunteers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 transition-colors"
                      />
                    </div>

                    {/* Shift Filter */}
                    <select
                      value={shiftFilter}
                      onChange={(e) => setShiftFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="all">All Shifts</option>
                      {availableShifts.map(shift => (
                        <option key={shift.id} value={shift.name}>{shift.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Volunteers Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Preferred Shift</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Timing</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Week Off Days</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredVolunteers.map((volunteer) => {
                      const shiftDetails = getShiftDetails(volunteer.preferredShift)
                      return (
                        <tr key={volunteer.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">{volunteer.name}</div>
                          </td>
                          <td className="py-4 px-6">
                            {volunteer.preferredShift ? (
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: shiftDetails?.color || '#6B7280' }}
                                />
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {volunteer.preferredShift}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Not assigned</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {shiftDetails ? (
                              <span className="text-sm text-gray-600">
                                {shiftDetails.startTime} - {shiftDetails.endTime}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {volunteer.weekOffDays.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {volunteer.weekOffDays.map(day => (
                                  <span 
                                    key={day} 
                                    className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full"
                                  >
                                    {day.substring(0, 3)}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No week off</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setNewVolunteer(volunteer)
                                  setEditingId(volunteer.id)
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit volunteer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeVolunteer(volunteer.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete volunteer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {/* Empty State */}
                {filteredVolunteers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                      <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No volunteers found</p>
                    <p className="text-gray-400 mt-1">
                      {volunteers.length === 0 
                        ? "Get started by adding your first volunteer"
                        : "Try adjusting your search or filters"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}