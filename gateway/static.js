import express from 'express'
import cors from 'cors'

class DustGatewayWorker{
    constructor(_options = {allowCORS: true}){
        this.options = _options
        process.send('init:begin')
        let app = new express()
        app.use(express.static(this.options.path))
        if(_options.allowCORS)
            app.use(cors())

        let server = app.listen(0, this.options.host)
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

new DustGatewayWorker({host: process.env.MASTER_HOST, port: process.env.MASTER_PORT, allowCORS: process.env.ALLOW_CORS, path: process.env.MASTER_PATH})