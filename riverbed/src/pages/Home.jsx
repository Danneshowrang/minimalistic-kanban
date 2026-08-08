import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listBoards, createBoard, boardExists, deleteBoard } from '../lib/storage.js'

export default function Home() {
  const [boards, setBoards] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => { setBoards(listBoards()) }, [])

  function handleCreate() {
    const code = createBoard(newTitle.trim())
    nav(`/board/${code}`)
  }

 function handleJoin() {
  const code = joinCode.trim()
  if (!code) return
  if (!boardExists(code)) { setError('No board with that code.'); return }
  nav(`/board/${code}`)
}

  function handleDelete(code) {
    if (!confirm('Delete this board? This cannot be undone.')) return
    deleteBoard(code)
    setBoards(listBoards())
  }

  return (
    <div className="home">
      <h1><span className="flowdot" /> Riverbed</h1>

      <div className="home-panel">
        <span className="fieldlabel">New board</span>
        <div className="home-row">
          <input
            type="text"
            placeholder="Board title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <button className="btn primary" onClick={handleCreate}>Create</button>
        </div>
      </div>

      <div className="home-panel">
        <span className="fieldlabel">Open with a board code</span>
        <div className="home-row">
          <input
            type="text"
            placeholder="ABC123"
            value={joinCode}
            onChange={e => { setJoinCode(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
          <button className="btn" onClick={handleJoin}>Open</button>
        </div>
        {error && <p className="error-text">{error}</p>}
      </div>

      {boards.length > 0 && (
        <div className="home-panel">
          <span className="fieldlabel">Your boards on this device</span>
          <div className="board-list">
            {boards.map(b => (
              <div className="board-list-row" key={b.code}>
                <a href={`#/board/${b.code}`} className="board-list-title">{b.title}</a>
                <span className="board-list-code">{b.code}</span>
                <button className="col-del" onClick={() => handleDelete(b.code)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}