import eventEmitter from './eventEmitter'
import { EVENTS } from './events'

export const createEventListeners = () => {
  eventEmitter.on(EVENTS.TODO_CREATED, (todo) => {
    console.log(`To-Do created: ${JSON.stringify(todo)}`)
  })

  eventEmitter.on(EVENTS.TODO_UPDATED, (todo) => {
    console.log(`To-Do updated: ${JSON.stringify(todo)}`)
  })

  eventEmitter.on(EVENTS.TODO_DELETED, (todo) => {
    console.log(`To-Do deleted: ${JSON.stringify(todo)}`)
  })
}
