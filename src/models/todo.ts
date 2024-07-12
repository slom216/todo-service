export interface Todo {
  id: number
  client_id: string
  title: string
  status: 'completed' | 'not completed'
}
