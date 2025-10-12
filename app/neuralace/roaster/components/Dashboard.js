import { Users, Clock, Calendar } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function Dashboard() {
  const { volunteers, shifts, weekSettings } = useAppContext()

  const stats = [
    {
      title: 'Total Volunteers',
      value: volunteers.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Shifts',
      value: shifts.length,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Working Days',
      value: weekSettings.workingDays.length,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium">Manage Volunteers</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-sm font-medium">Configure Shifts</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-5 h-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium">Generate Roster</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Week Overview</h2>
        <p className="text-gray-600">Generate a roster to see the week overview.</p>
      </div>
    </div>
  )
}