import React from 'react'
import BookmarksList from '../components/BookmarksList'
import HotelBookmarksList from '../components/HotelBookmarksList'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const auth = useAuth()
  const { user, bookmarks = [], removeBookmark } = auth || {}

  // segregate bookmarks into flights and hotels
  const flights = (bookmarks || []).filter((b) => {
    // flights usually have 'itineraries' or pricing fields
    return !!(b && (b.itineraries || b.pricing || b.price || b.type !== 'hotel')) && !(b.type === 'hotel')
  })
  const hotels = (bookmarks || []).filter((b) => b && (b.type === 'hotel' || b.hotel || b.hotelDetails))

  return (
    <div>
      <h2>Profile</h2>
      <div style={{ marginBottom: 8 }}>
        {user ? (
          <span>Signed in as <strong>{user.displayName || user.email}</strong></span>
        ) : (
          <span>You are not signed in.</span>
        )}
      </div>

      <section>
        <h3>Flights</h3>
        {flights && flights.length > 0 ? (
          <BookmarksList items={flights} onRemove={removeBookmark} />
        ) : (
          <div style={{ color: '#666' }}>No saved flights.</div>
        )}
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Hotels</h3>
        {hotels && hotels.length > 0 ? (
          <HotelBookmarksList items={hotels} onRemove={removeBookmark} />
        ) : (
          <div style={{ color: '#666' }}>No saved hotels.</div>
        )}
      </section>
    </div>
  )
}
