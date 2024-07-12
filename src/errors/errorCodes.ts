export const ERROR_CODES = {
  AUTHORIZATION_MIDDLEWARE: {
    AUTHORIZATION: {
      MISSING_AUTHORIZATION_HEADER: 'Authorization header is missing',
      INVALID_AUTHORIZATION_HEADER: 'Invalid Authorization header format',
    },
  },
  AUTH_CONTROLLER: {
    LOGIN: {
      MISSING_USERNAME_OR_PASSWORD: 'Missing username or password',
      INVALID_USERNAME_OR_PASSWORD: 'Invalid email or password',
    },
    REGISTER: {
      MISSING_USERNAME_OR_PASSWORD: 'Email and password are required',
      USERNAME_ALREADY_REGISTERED: 'Email is already registered',
    },
  },
  AUTH_SERVICE: {
    LOGIN: {
      INVALID_USERNAME_OR_PASSWORD: 'Invalid email or password',
    },
    REGISTER: {
      USERNAME_ALREADY_REGISTERED: 'Email is already registered',
    },
  },
  TODOS_CONTROLLER: {
    CREATE_TODO: {
      MISSING_TITLE_OR_STATUS: 'Title and status are required',
    },
    UPDATE_TODO: {
      MISSING_TITLE_OR_STATUS: 'Title and status are required',
    },
  },
  TODO_SERVICE: {
    UPDATE_TODO: {
      NO_CHANGES: 'No changes to update',
      OWNER_MISMATCH: 'To-Do does not belong to the user',
      TODO_NOT_FOUND: 'To-Do not found',
    },
    DELETE_TODO: {
      NO_CHANGES: 'No todo was deleted',
      OWNER_MISMATCH: 'To-Do does not belong to the user',
      TODO_NOT_FOUND: 'To-Do not found',
    },
  },
}
