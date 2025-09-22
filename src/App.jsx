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
    <div style={{ fontFamily: 'system-ui, Arial', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>QR Generator & Scanner</h1>
      <section style={{ marginBottom: 24 }}>
        <form onSubmit={handleGenerate}>
          <label>
            Text / URL
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 8 }}
            />
          </label>
          <div style={{ marginTop: 12 }}>
            <button type="submit">Generate & Save</button>
            <button type="button" onClick={handleDownloadSVG} style={{ marginLeft: 8 }}>Download SVG</button>
          </div>
        </form>
        <div style={{ marginTop: 12 }}>
          <h3>Preview</h3>
          <div>
            <QRCode id="qr-svg" value={text} />
          </div>
        </div>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h2>Scanner</h2>
        <div>
          {!scanning && (<button onClick={startScanner}>Start Camera Scanner</button>)}
          {scanning && (<button onClick={stopScanner}>Stop Scanner</button>)}
        </div>
        <div id={qrRegionId} style={{ marginTop: 12 }} />
      </section>
      <section>
        <h2>History</h2>
        <div style={{ marginBottom: 8 }}>
          <button onClick={clearHistory}>Clear history</button>
        </div>
        <ul>
          {history.map((h, idx) => (
            <li key={h.ts + idx} style={{ marginBottom: 6 }}>
              <div><strong>{h.value}</strong></div>
              <div style={{ fontSize: 12, color: '#666' }}>{new Date(h.ts).toLocaleString()}</div>
            </li>
          ))}
          {history.length === 0 && <li>No history yet.</li>}
        </ul>
      </section>
      <footer style={{ marginTop: 40, fontSize: 13, color: '#666' }}>
        <div>Built with React + html5-qrcode + qrcode.react</div>
      </footer>
    </div>
  )
}
