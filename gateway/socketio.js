import express from 'express'
import sio from 'socket.io'
import cors from 'cors'

class DustGatewayWorker{
    constructor(_options = {allowCORS: true}){
        this.options = _options
        process.send('init:begin')
        let app = new express()
        if(_options.allowCORS)
            app.use(cors())

        let server = app.listen(0, this.options.host),
            io = sio(server)
        io.on('connection', _client => {
            // console.log('WS CONNECTION',_client)
            _client.on('event', data => { /* … */ })
            _client.on('disconnect', () => { /* … */ })
            _client.emit('request',{bloop:123})
        })
        //io.adapter(sio_redis({ host: 'localhost', port: 6379 }));

        process.on('message', (message, connection) => {
            if(message === 'worker:shutdown'){
                this.shutdown()
                return
            }
            if(message !== 'sticky-session:connection'){
                return
            }
            server.emit('connection', connection)
            connection.resume()
        })
        process.send('init:complete')
    }
    shutdown(){
        process.send('shutdown:begin')
        process.send('shutdown:complete')
    }
}

new DustGatewayWorker({host: process.env.MASTER_HOST, port: process.env.MASTER_PORT, allowCORS: process.env.ALLOW_CORS})