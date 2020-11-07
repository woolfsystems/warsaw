import {DustState, DUST_STATE_INITIAL, DUST_STATE_TERMINATING, DUST_STATE_RUNNING, DUST_STATE_SHUTDOWN} from '../lib/DustState.js'

import cluster from 'cluster'
import os from 'os'
import errors from 'common-errors'
    //sio_redis = require('socket.io-redis'),
import farmhash from 'farmhash'

import most from '@most/core'
let { constant, scan, merge, tap, runEffects, fromPromise, fromEvent } = most

const num_processes = os.cpus().length


class DustListener extends DustState{
    constructor(){
        super()
    }
    next(i){
        console.log(i)
    }
    error(err){
        console.error(err)
    }
    complete(){
        console.log('COMPLETE')
    }
}
class DustGateway extends DustListener{
    constructor(_options){
        if(typeof _options==='undefined')
            throw new errors.ValidationError('No binding options passed to DustGateway')
        super()
        this.name = this.constructor.name
        this.options = _options
    }
    init(_broker){
        this.broker = _broker
        this.configure()
        return this.setupMaster().then(()=>{
            this.state = DUST_STATE_RUNNING
            this.emit('started')
        })
    }
    call(_method,_meta){
        most.fromPromise(promise)
    }
    configure(){
        throw new errors.NotImplementedError()
    }
    handler(connection){
        if(this.state === DUST_STATE_SHUTDOWN){
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
            if(this.state === DUST_STATE_SHUTDOWN)
                return
            this.broker.log.warn(`[${this.name}]`,'respawning worker', i)
            this.spawnWorker(i)
        }).on('message',(_code, _message) => {
            let [_section,_status] = _code.split(':')
            if(_code === 'shutdown:complete')
                this.workers[i].emit('shutdown')
            if(_code === 'init:complete')
                this.workers[i].emit('started')
            this.broker.log.info(`[${this.name}]`,_section,_status,_message)
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
        this.state = DUST_STATE_TERMINATING
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
            this.state = DUST_STATE_SHUTDOWN
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