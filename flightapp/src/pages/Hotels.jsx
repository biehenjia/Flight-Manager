import React, { useState } from 'react'
import { hotelsSearch } from '../API_calls.mjs'
import { useAuth } from '../contexts/AuthContext'

export default function Hotels() {
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  const { addBookmark, removeBookmark, bookmarks, user } = useAuth()

  async function handleSearch(e) {
    e && e.preventDefault()
    setError(null)
    setResults(null)
    if (!location || !checkIn || !checkOut) return setError('Please provide location, check-in and check-out')
    setLoading(true)
    try {
      const res = await hotelsSearch({ location, checkIn, checkOut, adults: 1 })
      if (res && res.error) {
        setError(res.error || JSON.stringify(res))
        setResults(null)
      } else {
        setResults(res)
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  function getBookmarkId(hotel, offer) {
    const hotelId = hotel && (hotel.hotelId || hotel.id || `${hotel.chainCode || ''}-${hotel.propertyId || ''}`)
    return hotelId || (offer && offer.id) || hotel.name || btoa(JSON.stringify(hotel || offer || {})).slice(0, 12)
  }

  function isBookmarked(hotel, offer) {
    const id = getBookmarkId(hotel, offer)
    return (bookmarks || []).some((b) => (b._bookmarkId || b.id || btoa(JSON.stringify(b)).slice(0, 12)) === id)
  }

  async function handleBookmarkToggle(hotel, offer) {
    if (!user) {
      console.error('bookmark: user not signed in')
      return
    }
    const id = getBookmarkId(hotel, offer)
    const bk = {
      type: 'hotel',
      id,
      title: hotel.name || hotel.address || 'Hotel',
      hotel: hotel,
      offer: offer,
      _createdAt: new Date().toISOString(),
    }
    try {
      if (isBookmarked(hotel, offer)) {
        await removeBookmark(bk)
      } else {
        await addBookmark(bk)
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err)
    }
  }


  const list = (results && results.data) || []

  return (
    <div>
      <h2>Hotel Search</h2>
      <form onSubmit={handleSearch}>
        <div>
          <input placeholder="City code (e.g. PAR)" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          
          <button type="submit" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
        </div>
      </form>

      {!loading && list.length === 0 && !error && <div>No results yet.</div>}

      {list.length > 0 && (
        <div>
          <h3>Results ({list.length})</h3>
          <div>
            {list.map((item, idx) => {
              const hotel = item.hotel || item || {}
              const offers = item.offers || item.hotelOffers || []
              const firstOffer = Array.isArray(offers) && offers.length ? offers[0] : null
              const price = firstOffer?.price && (firstOffer.price.total || firstOffer.price.base || firstOffer.price.currency)
              const key = item.id || hotel.hotelId || hotel.id || idx
              return (
                <div key={key}>
                  <div>
                    <div>
                      <div>{hotel.name || hotel.hotelName || hotel.propertyName || 'Hotel'}</div>
                      {hotel.address && <div>{hotel.address.lines ? hotel.address.lines.join(', ') : (hotel.address || '')}</div>}
                      <div>{hotel.chainCode ? `${hotel.chainCode} • ${hotel.propertyId || ''}` : hotel.hotelId || ''}</div>
                    </div>
                    <div>
                      <div>{price ? `${price}` : '—'}</div>
                      <div>
                        {firstOffer && (
                          <button type="button" onClick={() => handleBookmarkToggle(hotel, firstOffer)}>
                            {isBookmarked(hotel, firstOffer) ? 'Bookmarked' : 'Bookmark'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
