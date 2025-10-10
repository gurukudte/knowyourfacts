import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Settings, 
  Calendar 
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'volunteers', label: 'Volunteers', icon: Users },
  { id: 'shifts', label: 'Shifts', icon: Clock },
  { id: 'week-settings', label: 'Week Settings', icon: Settings },
  { id: 'roster', label: 'Roster', icon: Calendar },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}