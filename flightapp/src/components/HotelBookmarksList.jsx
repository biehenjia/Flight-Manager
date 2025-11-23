import React from 'react'

export default function HotelBookmarksList({ items = [], onRemove }) {
  if (!items || !items.length) return null

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Bookmarked Hotels</h3>
      <div>
        {items.map((b, idx) => {
          const id = b._bookmarkId || b.id || `hb-${idx}`
          const hotel = b.hotel || b.hotelDetails || {}
          const title = b.title || hotel.name || hotel.propertyName || 'Hotel'
          const address = hotel.address?.lines ? hotel.address.lines.join(', ') : hotel.address || ''
          const offer = b.offer || b.hotelOffer || null
          const price = offer?.price?.total || offer?.price || '—'

          return (
            <div key={id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{title}</div>
                  {address && <div style={{ fontSize: 12, color: '#666' }}>{address}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: 6 }}>{price}</div>
                  <div>
                    <button onClick={() => onRemove(b)} style={{ color: '#c00' }}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
