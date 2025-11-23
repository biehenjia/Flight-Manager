import React, { useState } from 'react'
import { getToken, flightOffer } from '../API_calls.mjs'
import { useAuth } from '../contexts/AuthContext'

function offerId(offer) {
  if (!offer) return null
  if (offer.id) return offer.id
  try {
    return btoa(JSON.stringify(offer)).slice(0, 12)
  } catch (e) {
    return String(Math.random()).slice(2, 10)
  }
}

export default function Flights() {
  const auth = useAuth()
  const { bookmarks = [], addBookmark, removeBookmark } = auth || {}
  const [origin, setOrigin] = useState('JFK')
  const [destination, setDestination] = useState('LAX')
  const [date, setDate] = useState('2025-12-01')
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOffers([])
    try {
      const token = await getToken()
      if (!token) throw new Error('Failed to get token')

      const flightSearchJSON = {
        currencyCode: 'USD',
        originDestinations: [
          {
            id: '1',
            originLocationCode: origin,
            destinationLocationCode: destination,
            arrivalDateTimeRange: { date: date, dateWindow: 'I3D' },
          },
        ],
        travelers: [
          {
            id: '1',
            travelerType: 'ADULT',
          },
        ],
        sources: ['GDS'],
        searchCriteria: { maxPrice: 999999 },
      }

      const res = await flightOffer(flightSearchJSON, token)
      if (!res) throw new Error('No offers returned')

      // Amadeus responses often have a `data` array; accept either an array or wrapped object
      const arr = Array.isArray(res) ? res : res.data || res.result || []
      // attach stable ids
      const normalized = arr.map((o) => ({ ...o, _bookmarkId: offerId(o) }))
      setOffers(normalized)
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  function isBookmarked(o) {
    const id = o._bookmarkId || offerId(o)
    return bookmarks.some((b) => (b._bookmarkId || b.id || offerId(b)) === id)
  }

  async function toggleBookmark(o) {
    const id = o._bookmarkId || offerId(o)
    if (isBookmarked(o)) {
      await removeBookmark({ ...o, _bookmarkId: id })
    } else {
      await addBookmark({ ...o, _bookmarkId: id })
    }
  }

  

  return (
    <div>
      <h2>Flights</h2>
      <section>

      </section>
      <form onSubmit={handleSearch}>
        <label>
          Origin
          <input value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} />
        </label>
        <label>
          Destination
          <input value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} />
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>

      {error && <div>{error}</div>}

      {offers && offers.length > 0 && (
        <div>
          <h3>Results</h3>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Carrier</th>
                <th>Bookmark</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => {
                const price = offer?.price?.total || (offer?.pricing?.price && offer.pricing.price.total) || '—'
                const itin = offer?.itineraries?.[0]
                const segs = itin?.segments || []
                const firstSeg = segs[0]
                const lastSeg = segs[segs.length - 1]
                const route = `${firstSeg?.departure?.iataCode || '—'} → ${lastSeg?.arrival?.iataCode || '—'}`
                const dep = firstSeg?.departure?.at || '—'
                const arr = lastSeg?.arrival?.at || '—'
                const carrier = firstSeg?.carrierCode || (segs[0]?.carrierCode) || '—'
                const id = offer._bookmarkId || offer.id || offerId(offer)

                return (
                  <tr key={id}>
                    <td>{price}</td>
                    <td>{route}</td>
                    <td>{dep}</td>
                    <td>{arr}</td>
                    <td>{carrier}</td>
                    <td>
                      <button onClick={() => toggleBookmark(offer)}>
                        {isBookmarked(offer) ? 'Bookmarked' : 'Bookmark'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookmarks moved to Profile page */}
    </div>
  )
}
