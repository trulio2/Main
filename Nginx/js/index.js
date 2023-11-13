import express, { json } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import os from 'os'

const app = express()

app.use(json())
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

app.get('/', (req, res) => {
  res.send(`Hello World from ${os.hostname()}!`)
})

app.get('/test', (req, res) => {
  res.send(`Test Hello World from ${os.hostname()}!`)
})

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    io.emit('message', `Hello from ${os.hostname()}! Message: ${msg.message}`)
  })
})

httpServer.listen(5001, () => {
  console.log('Server listening on port 5001')
})
