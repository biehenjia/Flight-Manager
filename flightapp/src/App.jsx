import React from 'react'
import './globals.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import UserTest from './components/UserTest'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Flights from './pages/Flights'
import Bookings from './pages/Bookings'
import About from './pages/About'
import NotFound from './pages/NotFound'
import OnSuccessfulPayment from './pages/Payment/OnSuccessfulPayment'
import OnFailedPayment from './pages/Payment/OnFailedPayment'

// for testing
import PaypalPaymentTest from './pages/PaypalPaymentTest'



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          {/* Core */}
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/about" element={<About />} />

          {/* Payments */}
          <Route path="/PaypalPaymentTest" element={<PaypalPaymentTest />} />
          <Route path="/OnSuccessfulPayment" element={<OnSuccessfulPayment />} />
          <Route path="/OnFailedPayment" element={<OnFailedPayment />} />

          {/* Misc */}
          <Route path="*" element={<NotFound />} />

        </Routes>
        <UserTest />
      </div>
    </BrowserRouter>
  )
}

export default App
