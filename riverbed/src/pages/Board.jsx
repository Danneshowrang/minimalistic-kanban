import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBoard, saveBoard } from '../lib/storage.js'
import Card from '../components/Card.jsx'
import TaskModal from '../components/TaskModal.jsx'

let idCounter = 1

function blankTask(col) {
  return { id: null, col, title: '', desc: '', urgency: 'Medium', type: '', assigned: '', subtasks: [] }
}

export default function Board() {
  const { code } = useParams()
  const [board, setBoard] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const dragId = useRef(null)
  const [overCol, setOverCol] = useState(null)

  useEffect(() => {
    const b = getBoard(code)
    setBoard(b)
  }, [code])

  useEffect(() => {
    if (board) saveBoard(board)
  }, [board])

  if (!board) {
    return (
      <div className="home">
        <p>No board found for code "{code}".</p>
        <Link to="/" className="btn">Back home</Link>
      </div>
    )
  }

  function updateTitle(title) { setBoard({ ...board, title }) }

  function addColumn() {
    const name = prompt('Column name:')
    if (name && name.trim()) setBoard({ ...board, columns: [...board.columns, name.trim()] })
  }

  function deleteColumn(col) {
    const hasTasks = board.tasks.some(t => t.col === col)
    if (hasTasks && !confirm(`"${col}" has tasks in it. Delete column and its tasks?`)) return
    setBoard({
      ...board,
      columns: board.columns.filter(c => c !== col),
      tasks: board.tasks.filter(t => t.col !== col)
    })
  }

  function openNew(col) { setEditingTask(blankTask(col)) }
  function openExisting(id) { setEditingTask(board.tasks.find(t => t.id === id)) }

  function handleSaveTask(t) {
    if (t.id) {
      setBoard({ ...board, tasks: board.tasks.map(x => x.id === t.id ? t : x) })
    } else {
      setBoard({ ...board, tasks: [...board.tasks, { ...t, id: 'local_' + Date.now() + '_' + idCounter++ }] })
    }
    setEditingTask(null)
  }

  function handleDeleteTask(id) {
    setBoard({ ...board, tasks: board.tasks.filter(t => t.id !== id) })
    setEditingTask(null)
  }

  function onDragStart(e, id) { dragId.current = id }
  function onDrop(col) {
    setBoard({
      ...board,
      tasks: board.tasks.map(t => t.id === dragId.current ? { ...t, col } : t)
    })
    setOverCol(null)
  }

  return (
    <div>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/" className="back-link">‹ Boards</Link>
          <input
            className="board-title-input"
            value={board.title}
            onChange={e => updateTitle(e.target.value)}
          />
          <span className="code-pill">{board.code}</span>
        </div>
        <button className="addcol-btn" onClick={addColumn}>+ Add column</button>
      </div>

      <div className="board">
        {board.columns.map(col => {
          const tasks = board.tasks.filter(t => t.col === col)
          return (
            <div className="column" key={col}>
              <div className="col-head">
                <span className="col-title">{col} <span className="col-count">{tasks.length}</span></span>
                <button className="col-del" onClick={() => deleteColumn(col)}>✕</button>
              </div>
              <div
                className={`dropzone ${overCol === col ? 'over' : ''}`}
                onDragOver={e => { e.preventDefault(); setOverCol(col) }}
                onDragLeave={() => setOverCol(null)}
                onDrop={() => onDrop(col)}
              >
                {tasks.map(t => (
                  <Card key={t.id} task={t} onOpen={openExisting}
                    onDragStart={onDragStart} onDragEnd={() => {}} />
                ))}
              </div>
              <button className="addtask-btn" onClick={() => openNew(col)}>+ Add task</button>
            </div>
          )
        })}
      </div>

      {editingTask && (
        <TaskModal
          task={editingTask}
          columns={board.columns}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}