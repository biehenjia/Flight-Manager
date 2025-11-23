import React from 'react'
import './globals.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

import UserTest from './components/UserTest'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Flights from './pages/Flights'
import Hotels from './pages/Hotels'
import TripPlanner from './pages/TripPlanner'
import Bookings from './pages/Bookings'
import Profile from './pages/Profile'
import About from './pages/About'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import OnSuccessfulPayment from './pages/Payment/OnSuccessfulPayment'
import OnFailedPayment from './pages/Payment/OnFailedPayment'

// for testing
import PaypalPaymentTest from './pages/PaypalPaymentTest'



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: '1rem' }}>
        <Routes>
          {/* Core */}
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/trip" element={<TripPlanner />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />

          {/* Payments */}
          <Route path="/PaypalPaymentTest" element={<PaypalPaymentTest />} />
          <Route path="/OnSuccessfulPayment" element={<OnSuccessfulPayment />} />
          <Route path="/OnFailedPayment" element={<OnFailedPayment />} />

          {/* Misc */}
          <Route path="*" element={<NotFound />} />

        </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
