import app from './app'
import config from './config/serverConfig'

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`)
})
