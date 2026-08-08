export default function Card({ task, onOpen, onDragStart, onDragEnd }) {
  const done = task.subtasks.filter(s => s.done).length
  const urgClass = 'urg-' + task.urgency.toLowerCase()

  return (
    <div
      className="card"
      draggable
      onDragStart={e => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(task.id)}
    >
      <p className="card-title">{task.title}</p>
      <div className="card-tags">
        <span className={`tag ${urgClass}`}>{task.urgency}</span>
        {task.type && <span className="tag type-tag">{task.type}</span>}
        {task.assigned && <span className="tag who-tag">{task.assigned}</span>}
      </div>
      {task.subtasks.length > 0 && (
        <div className="card-sub">☑ {done}/{task.subtasks.length} subtasks</div>
      )}
    </div>
  )
}