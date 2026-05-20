import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { EventDetailPage } from './pages/EventDetailPage'
import './styles/globals.css'

export function App() {
  return (
    <BrowserRouter basename="/countdown">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/countdown/:eventId" element={<EventDetailPage />} />
          <Route
            path="*"
            element={
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Page not found</h1>
                <a
                  href="/"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
                >
                  Back to Home
                </a>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
