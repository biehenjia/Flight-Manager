import React, { useEffect, useRef, useState } from 'react'

// Very simple table-based chat window. Connects to a local WebSocket server at ws://localhost:3456
export default function ChatWindow({ url = 'ws://localhost:3456' }) {
  const [ws, setWs] = useState(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([]) // {from: 'me'|'agent', text, time}
  const inputRef = useRef()
  const boxRef = useRef()

  useEffect(() => {
    let socket
    try {
      socket = new WebSocket(url)
    } catch (e) {
      console.error('WebSocket init failed', e)
      return
    }

    socket.addEventListener('open', () => {
      setConnected(true)
      setMessages((m) => [...m, { from: 'system', text: 'Connected to support', time: new Date().toISOString() }])
    })
    socket.addEventListener('message', (ev) => {
      const text = String(ev.data || '')
      setMessages((m) => [...m, { from: 'agent', text, time: new Date().toISOString() }])
    })
    socket.addEventListener('close', () => {
      setConnected(false)
      setMessages((m) => [...m, { from: 'system', text: 'Disconnected', time: new Date().toISOString() }])
    })
    socket.addEventListener('error', (err) => {
      console.error('WebSocket error', err)
      setMessages((m) => [...m, { from: 'system', text: 'Connection error', time: new Date().toISOString() }])
    })

    setWs(socket)

    return () => {
      try { socket && socket.close() } catch (e) {}
    }
  }, [url])

  useEffect(() => {
    // scroll to bottom when messages change
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight
    }
  }, [messages])

  function sendMessage() {
    const text = inputRef.current && inputRef.current.value
    if (!text) return
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(text)
      setMessages((m) => [...m, { from: 'me', text, time: new Date().toISOString() }])
      inputRef.current.value = ''
    } else {
      setMessages((m) => [...m, { from: 'system', text: 'Not connected', time: new Date().toISOString() }])
    }
  }

  return (
    <div>
      <h2>customer support </h2>
      <div style={{ border: '1px solid #ddd', padding: 8, width: '100%', maxWidth: 720 }}>
        <div style={{ marginBottom: 8 }}><strong>Status:</strong> {connected ? 'Connected' : 'Disconnected'}</div>

        <div ref={boxRef} style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', padding: 8, background: '#fafafa' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {messages.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f2f2f2' }}>
                  <td style={{ width: 120, padding: 6, verticalAlign: 'top', fontSize: 12, color: '#666' }}>{m.from}</td>
                  <td style={{ padding: 6 }}>{m.text}</td>
                  <td style={{ width: 160, padding: 6, fontSize: 11, color: '#999' }}>{new Date(m.time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <input ref={inputRef} placeholder="Type your message" style={{ flex: 1 }} onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }} />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}
