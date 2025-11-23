import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import GoogleAuthButton from './GoogleAuthButton'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Home
        </NavLink>
        <NavLink to="/flights" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Flights
        </NavLink>
        <NavLink to="/trip" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Trip
        </NavLink>
        <NavLink to="/hotels" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Hotels
        </NavLink>
        <NavLink to="/bookings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Bookings
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Profile
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          About
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Chat
        </NavLink>
        {/* for testing: */}
        <NavLink to="/PaypalPaymentTest" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          PaypalPaymentTest
        </NavLink>
      </div>

      <div className="nav-right">
        <GoogleAuthButton />
      </div>
    </nav>
  )
}
