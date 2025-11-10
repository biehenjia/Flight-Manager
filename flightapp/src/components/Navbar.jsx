import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Home
      </NavLink>
      <NavLink to="/flights" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Flights
      </NavLink>
      <NavLink to="/bookings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Bookings
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        About
      </NavLink>
      
      {/* for testing: */}
      <NavLink to="/PaypalPaymentTest" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        PaypalPaymentTest
      </NavLink>
    </nav>
  )
}
