import React from 'react'

export default function BookmarksList({ items = [], onRemove }) {
  if (!items || !items.length) return null

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Bookmarked Flights</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Price</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Route</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Departure</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Arrival</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((offer) => {
            const id = offer._bookmarkId || offer.id || JSON.stringify(offer).slice(0, 8)
            const price = offer?.price?.total || (offer?.pricing?.price && offer.pricing.price.total) || '—'
            const itin = offer?.itineraries?.[0]
            const firstSeg = itin?.segments?.[0]
            const lastSeg = itin?.segments?.[itin.segments.length - 1]
            const route = `${firstSeg?.departure?.iataCode || '—'} → ${lastSeg?.arrival?.iataCode || '—'}`
            const dep = firstSeg?.departure?.at || '—'
            const arr = lastSeg?.arrival?.at || '—'

            return (
              <tr key={id}>
                <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>{price}</td>
                <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>{route}</td>
                <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>{dep}</td>
                <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>{arr}</td>
                <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>
                  <button onClick={() => onRemove(offer)} style={{ color: '#c00' }}>
                    Remove
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
