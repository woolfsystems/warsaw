import cluster from 'cluster'
import os from 'os'
import errors from 'common-errors'
    //sio_redis = require('socket.io-redis'),
import farmhash from 'farmhash'

const num_processes = os.cpus().length

class DustGateway{
    constructor(_options = {port: 3000, host: 'localhost', serve: 'public'}){
        this.name = this.constructor.name
        this.options = _options
    }
    init(_broker){
        this.broker = _broker
        this.configure()
        this.setupMaster()
    }
    configure(){
        throw new errors.NotImplementedError()
    }
    handler(connection){
        //this.broker.log.trace('[HANDLER]', connection)
        let worker_id = this.getWorkerIndex(connection.remoteAddress, num_processes)
        this.workers[worker_id].send('sticky-session:connection', connection)
    }
    setupMaster(){
        this.broker.log.info('[MASTER]','setup')
        this.workers = []
        for (var i = 0; i < num_processes; i++) {
            this.spawnWorker(i)
        }
    }
    spawnWorker(i) {
        this.workers[i] = cluster.fork({MASTER_HOST: this.options.host, MASTER_PORT: this.options.port, MASTER_PATH: this.options.serve})

        this.workers[i].on('exit',(code, signal) => {
            this.broker.log.warn(`[${this.name}]`,'respawning worker', i)
            this.spawnWorker(i)
        }).on('message',(message) => {
            this.broker.log.trace(`[${this.name}]`,'message',message)
        })
    }
    getWorkerIndex(ip, len) {
        return farmhash.fingerprint32(ip) % len // Farmhash is the fastest and works with IPv6, too
    }
    extractSchema(){
        return {
            name: this.name
        }
    }
    shutdown(){
        console.log('GW SHUTDOWN')
        this.workers.forEach(worker=>
            worker.send('worker:shutdown'))
    }
}

class DustGatewaySocketIO extends DustGateway{
    configure(){
        cluster.setupMaster({
            exec: 'gateway/socketio.js',
            silent: false
        })
    }


}

class DustGatewayExpressStatic extends DustGateway{
    configure(){
        cluster.setupMaster({
            exec: 'gateway/static.js',
            silent: false
        })
    }
}

export {
    DustGateway,
    DustGatewaySocketIO,
    DustGatewayExpressStatic
}