export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Shift Roster Manager</h1>
          </div>
          <p className="text-gray-600">Manage volunteers, shifts, and generate rosters efficiently</p>
        </div>
      </div>
    </header>
  )
}