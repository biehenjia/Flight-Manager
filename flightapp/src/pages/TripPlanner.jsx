import React, { useState } from 'react'
import { getToken, flightOffer, hotelsSearch } from '../API_calls.mjs'
import { useAuth } from '../contexts/AuthContext'

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function makeOfferHash(item) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(item)))).slice(0, 64)
  } catch (e) {
    return String(Date.now()) + Math.random().toString(36).slice(2, 8)
  }
}

export default function TripPlanner() {
  const { user, addBookmark } = useAuth() || {}
  const [origin, setOrigin] = useState('YYZ')
  const [startDate, setStartDate] = useState('')
  const [stops, setStops] = useState([{ city: 'YUL', nights: 3 }])
  const [adults, setAdults] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  function updateStop(index, key, value) {
    setStops((s) => {
      const copy = [...s]
      copy[index] = { ...copy[index], [key]: value }
      return copy
    })
  }

  function addStop() {
    setStops((s) => [...s, { city: '', nights: 1 }])
  }

  function removeStop(i) {
    setStops((s) => s.filter((_, idx) => idx !== i))
  }

  async function handlePlan(e) {
    e && e.preventDefault()
    setError(null)
    setResults(null)
    if (!startDate) return setError('Please pick a start date')
    if (!origin) return setError('Please provide an origin')
    if (!stops.length) return setError('Add at least one destination')

    setLoading(true)
    try {
      const itinerary = []
      let currentOrigin = origin
      let currentDate = startDate

      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i]
        const city = (stop.city || '').toUpperCase()
        const nights = Number(stop.nights) || 1

        // Flight search
        const token = await getToken()
        let flightOffers = []
        if (token) {
          const flightSearchJSON = {
            currencyCode: 'USD',
            originDestinations: [
              { id: '1', originLocationCode: currentOrigin, destinationLocationCode: city, arrivalDateTimeRange: { date: currentDate, dateWindow: 'I3D' } }
            ],
            travelers: [{ id: '1', travelerType: 'ADULT' }],
            sources: ['GDS'],
            searchCriteria: { maxPrice: 999999 }
          }
          const res = await flightOffer(flightSearchJSON, token)
          const arr = Array.isArray(res) ? res : (res && res.data) || []
          flightOffers = Array.isArray(arr) ? arr.slice(0, 3) : []
        }

        // Hotel search
        const checkIn = currentDate
        const checkOut = addDays(checkIn, nights)
        const hotelsRes = await hotelsSearch({ location: city, checkIn, checkOut, adults, max: 3 })
        const hotelOffers = (hotelsRes && hotelsRes.data) || []

        itinerary.push({
          city,
          arrival: checkIn,
          departure: checkOut,
          nights,
          flights: flightOffers,
          hotels: hotelOffers.slice(0, 3),
        })

        currentOrigin = city
        currentDate = checkOut
      }

      setResults({ origin, startDate, itinerary })
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  function renderFlight(offer, idx) {
    const price = offer?.price?.total || offer?.price?.grandTotal || offer?.price?.amount || (offer?.itineraries && offer?.price?.total) || 'N/A'
    const carriers = (offer?.validatingAirlineCodes || (offer?.itineraries || []).map(it => (it.segments || []).map(s => s.carrierCode).join(',')).join(' ')) || ''
    return (
      <div key={idx} style={{ padding: 8, border: '1px solid #eee', marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13 }}>{carriers || offer?.type || 'Flight'}</div>
          <div><strong>{price}</strong></div>
        </div>
        <details style={{ marginTop: 6 }}>
          <summary style={{ cursor: 'pointer' }}>Details</summary>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(offer, null, 2)}</pre>
        </details>
      </div>
    )
  }

  function renderHotel(item, idx) {
    const hotel = item.hotel || item || {}
    const name = hotel.name || hotel?.hotel?.name || hotel?.propertyName || 'Hotel'
    const price = (item.offers && item.offers[0] && (item.offers[0].price?.total || item.offers[0].price?.amount)) || item?.offers?.[0]?.price?.total || 'N/A'
    return (
      <div key={idx} style={{ padding: 8, border: '1px solid #eee', marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>{name}</div>
          <div><strong>{price}</strong></div>
        </div>
        <div style={{ marginTop: 8 }}>
          <button onClick={() => { if (addBookmark) addBookmark({ type: 'hotel', hotel: hotel, offer: item.offers && item.offers[0] }) }} disabled={!user}>{user ? '☆ Bookmark' : 'Sign in to bookmark'}</button>
        </div>
        <details style={{ marginTop: 6 }}>
          <summary>Details</summary>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(item, null, 2)}</pre>
        </details>
      </div>
    )
  }

  return (
    <div>
      <h1>Trip Planner</h1>
      <form onSubmit={handlePlan} style={{ maxWidth: 900, display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            Origin (3-letter code)
            <input value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column' }}>
            Start date
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column' }}>
            Adults
            <input type="number" min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value) || 1)} />
          </label>
        </div>

        <div>
          <h3>Destinations</h3>
          {stops.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <input placeholder="City" value={s.city} onChange={(e) => updateStop(i, 'city', e.target.value.toUpperCase())} />
              <input type="number" min={1} style={{ width: 100 }} value={s.nights} onChange={(e) => updateStop(i, 'nights', Number(e.target.value) || 1)} />
              <button type="button" onClick={() => removeStop(i)}>Remove</button>
            </div>
          ))}

          <button type="button" onClick={addStop}>Add destination</button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading}>{loading ? 'Planning…' : 'Plan trip'}</button>
          <button type="button" onClick={() => { setResults(null); setError(null); }}>Clear</button>
        </div>
      </form>

      <section style={{ marginTop: 20 }}>
        {error && <div style={{ color: 'crimson' }}>Error: {error}</div>}

        {!results && !loading && <p>Enter a start date, origin and destinations to plan a trip.</p>}

        {results && (
          <div>
            <h2>PLAN: {results.origin} starting {results.startDate}</h2>
            {results.itinerary.map((leg, idx) => (
              <div key={idx} style={{ marginBottom: 20 }}>
                <h3>{leg.city} for {leg.nights} night(s) ({leg.arrival} to {leg.departure})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <h4>Top {leg.flights.length} flights</h4>
                    {leg.flights.length ? leg.flights.map((f, i) => renderFlight(f, i)) : <div>No flights</div>}
                  </div>

                  <div>
                    <h4>Top {leg.hotels.length} hotels</h4>
                    {leg.hotels.length ? leg.hotels.map((h, i) => renderHotel(h, i)) : <div>No hotels</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
