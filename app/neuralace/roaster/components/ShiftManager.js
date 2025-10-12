import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function ShiftManager() {
  const { shifts, addShift, removeShift } = useAppContext()
  const [newShift, setNewShift] = useState({
    name: '',
    startTime: '',
    endTime: ''
  })

  const handleAddShift = () => {
    if (newShift.name.trim() && newShift.startTime && newShift.endTime) {
      addShift(newShift)
      setNewShift({ name: '', startTime: '', endTime: '' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Shift</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Shift Name (e.g., Shift-1)"
            value={newShift.name}
            onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="time"
            value={newShift.startTime}
            onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="time"
            value={newShift.endTime}
            onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleAddShift}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Shift
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shifts ({shifts.length})</h2>
        <div className="grid gap-4">
          {shifts.map((shift) => (
            <div key={shift.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{shift.name}</h3>
                <p className="text-sm text-gray-600">{shift.startTime} - {shift.endTime}</p>
              </div>
              <button
                onClick={() => removeShift(shift.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}