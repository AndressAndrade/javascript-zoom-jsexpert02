const server = require('http').createServer((request, response) => {
    response.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    })
    response.end('hey there!')
})

const socketIo = require('socket.io')

const io = socketIo(server, {
    cors: {
        origin: '*',
        credentials: false
    }
})

io.on('connection', socket => {
    console.log('connection', socket.id)
    socket.on('join-room', (roomId, userId) => {
        // Adiciona os usuários na mesma sala
        socket.join(roomId)
        // Avisa aos demais na sala que um novo usuário chegou
        socket.to(roomId).broadcast.emit('user-connected', userId)
        // Avisa aos demais na sala que o usuário saiu
        socket.on('disconnect', () => {
            console.log('disconnected!', roomId, userId)
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

const startServer = () => {
    const {address, port} = server.address()
    console.info(`app running at ${address}:${port}`)
}

server.listen(process.env.PORT || 3003, startServer)