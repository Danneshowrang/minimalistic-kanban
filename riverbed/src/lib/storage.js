const INDEX_KEY = 'riverbed_boards_index'

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  const bytes = new Uint32Array(8)
  crypto.getRandomValues(bytes)
  let code = ''
  for (let i = 0; i < 8; i++) code += chars[bytes[i] % chars.length]
  return code
}

export function listBoards() {
  const raw = localStorage.getItem(INDEX_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveIndex(index) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index))
}

export function createBoard(title) {
  let code = genCode()
  const index = listBoards()
  while (index.some(b => b.code === code)) code = genCode()

  const board = {
    code,
    title: title || 'Untitled board',
    columns: ['Backlog', 'To Do', 'Up Next', 'In Progress', 'Done'],
    tasks: []
  }
  localStorage.setItem('riverbed_board_' + code, JSON.stringify(board))
  saveIndex([...index, { code, title: board.title }])
  return code
}

export function getBoard(code) {
  const raw = localStorage.getItem('riverbed_board_' + code)
  return raw ? JSON.parse(raw) : null
}

export function saveBoard(board) {
  localStorage.setItem('riverbed_board_' + board.code, JSON.stringify(board))
  const index = listBoards().map(b =>
    b.code === board.code ? { code: board.code, title: board.title } : b
  )
  saveIndex(index)
}

export function deleteBoard(code) {
  localStorage.removeItem('riverbed_board_' + code)
  saveIndex(listBoards().filter(b => b.code !== code))
}

export function boardExists(code) {
  return listBoards().some(b => b.code === code)
}