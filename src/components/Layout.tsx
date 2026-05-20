import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SITE_NAME } from '../utils/constants'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => {
                navigate('/')
                setMobileMenuOpen(false)
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⏱</span>
              </div>
              <span className="hidden sm:inline text-2xl font-bold gradient-text">{SITE_NAME}</span>
              <span className="sm:hidden text-xl font-bold gradient-text">Countdown</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden tap-target p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Features
              </a>
            </nav>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 py-4 border-t border-gray-200 space-y-2 animate-slide-down">
              <a
                href="#features"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Features
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                GitHub
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 md:mt-20 border-t border-gray-200/50 bg-gradient-to-b from-gray-50/50 to-blue-50/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="fade-in">
              <h3 className="font-bold text-gray-900 mb-3">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {SITE_NAME} tracks upcoming events with live countdown timers. Never miss an important date again.
              </p>
            </div>
            <div className="fade-in">
              <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Movies</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Sports</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Music</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Gaming</li>
              </ul>
            </div>
            <div className="fade-in">
              <h3 className="font-bold text-gray-900 mb-3">Resources</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <a href="/" className="hover:text-blue-600 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-blue-600 transition-colors">
                    All Events
                  </a>
                </li>
              </ul>
            </div>
            <div className="fade-in">
              <h3 className="font-bold text-gray-900 mb-3">Support</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <a href="mailto:support@countdown.singhyogendra.com.np" className="hover:text-blue-600 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200/50 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <p>&copy; 2026 {SITE_NAME}. All rights reserved.</p>
              <div className="flex gap-4 text-xs">
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Privacy
                </a>
                <span>•</span>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
