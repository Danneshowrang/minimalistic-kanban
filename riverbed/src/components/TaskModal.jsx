import { useState } from 'react'

const URGENCIES = ['Low', 'Medium', 'High', 'Critical']

export default function TaskModal({ task, columns, onSave, onDelete, onClose }) {
  const [t, setT] = useState(task)

  function update(field, value) { setT({ ...t, [field]: value }) }

  function updateSub(i, text) {
    const subtasks = [...t.subtasks]
    subtasks[i] = { ...subtasks[i], text }
    setT({ ...t, subtasks })
  }
  function toggleSub(i) {
    const subtasks = [...t.subtasks]
    subtasks[i] = { ...subtasks[i], done: !subtasks[i].done }
    setT({ ...t, subtasks })
  }
  function removeSub(i) {
    setT({ ...t, subtasks: t.subtasks.filter((_, idx) => idx !== i) })
  }
  function addSub() {
    setT({ ...t, subtasks: [...t.subtasks, { text: '', done: false }] })
  }

  function handleSave() {
    if (!t.title.trim()) { alert('Give the task a title.'); return }
    onSave({ ...t, subtasks: t.subtasks.filter(s => s.text.trim() !== '') })
  }

  return (
    <div className="overlay show" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <input
          type="text" className="titlein" placeholder="Task title"
          value={t.title} onChange={e => update('title', e.target.value)}
        />

        <span className="fieldlabel">Column</span>
        <select value={t.col} onChange={e => update('col', e.target.value)}>
          {columns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="row3">
          <div>
            <span className="fieldlabel">Urgency</span>
            <select value={t.urgency} onChange={e => update('urgency', e.target.value)}>
              {URGENCIES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <span className="fieldlabel">Type</span>
            <input type="text" placeholder="e.g. Feature" value={t.type}
              onChange={e => update('type', e.target.value)} />
          </div>
          <div>
            <span className="fieldlabel">Assigned</span>
            <input type="text" placeholder="Name" value={t.assigned}
              onChange={e => update('assigned', e.target.value)} />
          </div>
        </div>

        <span className="fieldlabel">Description</span>
        <textarea rows="3" placeholder="What needs doing..."
          value={t.desc} onChange={e => update('desc', e.target.value)} />

        <span className="fieldlabel">Subtasks</span>
        {t.subtasks.map((s, i) => (
          <div className="subtask-row" key={i}>
            <input type="checkbox" checked={s.done} onChange={() => toggleSub(i)} />
            <input type="text" value={s.text} placeholder="Subtask..."
              onChange={e => updateSub(i, e.target.value)} />
            <button onClick={() => removeSub(i)}>✕</button>
          </div>
        ))}
        <button className="addsub-btn" onClick={addSub}>+ Add subtask</button>

        <div className="modal-actions">
          <div>
            {t.id && <button className="btn danger" onClick={() => onDelete(t.id)}>Delete</button>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}