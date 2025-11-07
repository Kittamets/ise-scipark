import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar onMenuClick={() => setShowSidebar(true)} />
      
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
      
      {/* Backdrop */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSidebar(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="pt-20 pb-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg font-bold mb-2">🚗 SciPark - Smart Parking System</p>
          <p className="text-sm opacity-90">Made with ❤️ by SciPark Team</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
