import {EventEmitter} from 'events'

import cluster from 'cluster'
import os from 'os'
import errors from 'common-errors'
    //sio_redis = require('socket.io-redis'),
import farmhash from 'farmhash'

const num_processes = os.cpus().length

const GATEWAY_STATE_SHUTDOWN = Symbol('GW_STATE_SHUTDOWN')
const GATEWAY_STATE_INIT = Symbol('GW_STATE_INIT')
const GATEWAY_STATE_STARTED = Symbol('GW_STATE_STARTED')

class DustGateway extends EventEmitter{
    constructor(_options){
        if(typeof _options==='undefined')
            throw new errors.ValidationError('No binding options passed to DustGateway')
        super()
        this.name = this.constructor.name
        this.options = _options
        this.state = GATEWAY_STATE_INIT
    }
    init(_broker){
        this.broker = _broker
        this.broker.log.warn(`[${this.name}]`,'init','begin')
        this.configure()
        return this.setupMaster().then(()=>{
            this.state = GATEWAY_STATE_STARTED
            this.broker.log.warn(`[${this.name}]`,'init', 'complete')
            this.emit('started')
        })
    }
    configure(){
        throw new errors.NotImplementedError()
    }
    handler(connection){
        if(this.state === GATEWAY_STATE_SHUTDOWN){
            this.broker.log.warn(`[${this.name}]`,'discarding incoming connection')
            return
        }
        //this.broker.log.trace('[HANDLER]', connection)
        let worker_id = this.getWorkerIndex(connection.remoteAddress, num_processes)
        this.workers[worker_id].send('sticky-session:connection', connection)
    }
    setupMaster(){
        this.workers = []
        return Promise.all(new Array(num_processes).fill(0).map((_,_i)=>
            new Promise((resolve,reject)=>
                this.spawnWorker(_i).once('started',resolve))))
    }
    spawnWorker(i) {
        this.workers[i] = cluster.fork({MASTER_HOST: this.options.host, MASTER_PORT: this.options.port, MASTER_PATH: this.options.serve})

        this.workers[i].on('exit',(_code, _signal) => {
            if(this.state === GATEWAY_STATE_SHUTDOWN)
                return
            this.broker.log.warn(`[${this.name}]`,'respawning worker', i)
            this.spawnWorker(i)
        }).on('message',(_code, _message) => {
            let [_section,_status] = _code.split(':')
            if(_code === 'shutdown:complete')
                this.workers[i].emit('shutdown')
            if(_code === 'init:complete')
                this.workers[i].emit('started')
            this.broker.log.trace(`[${this.name}]`,_section,_status,_message)
        })
        return this.workers[i]
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
        this.broker.log.info(`[${this.name}]`,'GW','shutdown','begin')
        this.state = GATEWAY_STATE_SHUTDOWN
        return Promise.all(this.workers.map(worker=>
            new Promise((resolve, reject)=>{
                worker
                    .once('shutdown',()=>{
                        worker.disconnect()
                        resolve()    
                    })
                    .send('worker:shutdown')
            })
        )).then(()=>{
            this.broker.log.info(`[${this.name}]`,'GW','shutdown','complete')
            this.emit('shutdown')
        })
    }
}

class DustGatewaySocketIO extends DustGateway{
    configure(){
        cluster.setupMaster({
            cwd: 'gateway',
            exec: 'socketio.js',
            silent: false
        })
    }


}

class DustGatewayExpressStatic extends DustGateway{
    configure(){
        cluster.setupMaster({
            cwd: 'gateway',
            exec: 'static.js',
            silent: false
        })
    }
}

export {
    DustGateway,
    DustGatewaySocketIO,
    DustGatewayExpressStatic
}