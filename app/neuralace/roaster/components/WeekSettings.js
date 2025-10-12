import { useAppContext } from '../context/AppContext'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function WeekSettings() {
  const { weekSettings, updateWeekSettings } = useAppContext()

  const toggleDay = (day) => {
    if (weekSettings.workingDays.includes(day)) {
      updateWeekSettings({
        workingDays: weekSettings.workingDays.filter(d => d !== day),
        weekOffDays: [...weekSettings.weekOffDays, day]
      })
    } else {
      updateWeekSettings({
        weekOffDays: weekSettings.weekOffDays.filter(d => d !== day),
        workingDays: [...weekSettings.workingDays, day]
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Week Settings</h2>
        <p className="text-gray-600 mb-6">Select which days are working days and which are week-off days.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Working Days ({weekSettings.workingDays.length})</h3>
            <div className="space-y-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    id={day}
                    checked={weekSettings.workingDays.includes(day)}
                    onChange={() => toggleDay(day)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={day} className="ml-2 text-sm text-gray-700">
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Week Off Days ({weekSettings.weekOffDays.length})</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {weekSettings.weekOffDays.length > 0 ? (
                <ul className="space-y-2">
                  {weekSettings.weekOffDays.map((day) => (
                    <li key={day} className="text-sm text-gray-700 bg-white px-3 py-2 rounded border">
                      {day}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No week-off days selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}