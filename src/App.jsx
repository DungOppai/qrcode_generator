import React, { useState, useRef, useEffect } from 'react'
import QRCode from "react-qr-code";
import { Html5Qrcode } from 'html5-qrcode'

export default function App() {
  const [text, setText] = useState('https://example.com')
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('qr_history') || '[]')
    } catch (e) {
      return []
    }
  })
  const [scanning, setScanning] = useState(false)
  const qrRegionId = 'html5qr-scanner'
  const html5QrRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('qr_history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {})
      }
    }
  }, [])

  function addToHistory(value) {
    const item = { value, ts: Date.now() }
    setHistory(prev => [item, ...prev].slice(0, 50))
  }

  function handleGenerate(e) {
    e.preventDefault()
    addToHistory(text)
  }

  async function startScanner() {
    setScanning(true)
    const config = { fps: 10, qrbox: 250 }
    try {
      html5QrRef.current = new Html5Qrcode(qrRegionId)
      await html5QrRef.current.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          alert('QR detected: ' + decodedText)
          addToHistory(decodedText)
          stopScanner()
        }
      )
    } catch (err) {
      console.error('Could not start scanner', err)
      setScanning(false)
    }
  }

  function stopScanner() {
    if (html5QrRef.current) {
      html5QrRef.current.stop().then(() => {
        html5QrRef.current.clear()
        html5QrRef.current = null
        setScanning(false)
      }).catch(() => setScanning(false))
    }
  }

  function handleDownloadSVG() {
    const svg = document.getElementById('qr-svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svg)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qr-code.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  function clearHistory() {
    setHistory([])
    localStorage.removeItem('qr_history')
  }

  return (
    <div style={{
    fontFamily: 'Inter, system-ui, Arial',
    background: '#f8fafc',
    minHeight: '100vh',
    padding: 0,
    margin: 0
  }}>
    <div style={{
      maxWidth: 420,
      margin: '40px auto',
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      padding: 32
    }}>
      <h1 style={{
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 24,
        letterSpacing: -1,
        color: '#222'
      }}>QR Generator & Scanner</h1>
      <section style={{ marginBottom: 32 }}>
        <form onSubmit={handleGenerate}>
          <label style={{ fontWeight: 500, fontSize: 15, color: '#444' }}>
            Text / URL
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                marginTop: 8,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 15,
                outline: 'none',
                background: '#f1f5f9'
              }}
            />
          </label>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button type="submit" style={{
              background: '#0b74de',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}>Generate & Save</button>
            <button type="button" onClick={handleDownloadSVG} style={{
              background: '#e2e8f0',
              color: '#222',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}>Download SVG</button>
          </div>
        </form>
        <div style={{ marginTop: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Preview</h3>
          <div style={{
            background: '#f1f5f9',
            borderRadius: 12,
            padding: 18,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <QRCode id="qr-svg" value={text} />
          </div>
        </div>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Scanner</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          {!scanning && (<button onClick={startScanner} style={{
            background: '#0b74de',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            fontWeight: 500,
            cursor: 'pointer'
          }}>Start Camera Scanner</button>)}
          {scanning && (<button onClick={stopScanner} style={{
            background: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            fontWeight: 500,
            cursor: 'pointer'
          }}>Stop Scanner</button>)}
        </div>
        <div id={qrRegionId} style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden' }} />
      </section>
      <section>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>History</h2>
        <div style={{ marginBottom: 8 }}>
          <button onClick={clearHistory} style={{
            background: '#e2e8f0',
            color: '#222',
            border: 'none',
            borderRadius: 8,
            padding: '8px 14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}>Clear history</button>
        </div>
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {history.map((h, idx) => (
            <li key={h.ts + idx} style={{
              marginBottom: 10,
              background: '#f1f5f9',
              borderRadius: 8,
              padding: '10px 14px'
            }}>
              <div style={{ fontWeight: 500 }}>{h.value}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{new Date(h.ts).toLocaleString()}</div>
            </li>
          ))}
          {history.length === 0 && <li style={{
            color: '#888',
            fontSize: 14,
            padding: '10px 14px'
          }}>No history yet.</li>}
        </ul>
      </section>
      <footer style={{
        marginTop: 40,
        fontSize: 13,
        color: '#888',
        textAlign: 'center'
      }}>
      </footer>
    </div>
  </div>
  )
}
