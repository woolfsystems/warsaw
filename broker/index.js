import chalk from 'chalk'
import prefix from 'loglevel-plugin-prefix'
import {EventEmitter} from 'events'
const log_colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
}

import net from 'net'
import ascoltatori from 'ascoltatori'
import errors from 'common-errors'
import loglevel from 'loglevel'

const SERVICE_CHANNEL = '__SERVICE__'
const CALL_CHANNEL = '__CALL__'
const GATEWAY_CHANNEL = '__GATEWAY__'

class DustSocket{
    constructor(_broker, _options){
        this.broker = _broker
        this.options = _options
        this.socket = net.createServer({ pauseOnConnect: true})
        this.socket.listen({...this.options, exclusive: true},()=>{
            this.broker.log.info('[NET]','listening',this.options)
        })
        this.socket.on('error', (err) => {
            throw err
        }) 
    }
    attachHandler(_handler){
        this.socket.on('connection',_handler)
    }
    shutdown(){
        this.broker.log.info('[NET]','shutdown','begin')
        return new Promise((resolve,reject)=>{
            this.socket.close(resolve)
        }).then(()=>{
            this.broker.log.info('[NET]','shutdown','complete')
        })
    }
}
class DustBroker extends EventEmitter{
    constructor(_options){
        super()
        this.log = loglevel
        prefix.reg(this.log)
        prefix.apply(this.log, {
            nameFormatter(_name){
                _name = 'DUST'
                return `[${_name}]`
            },
            format(level, name, timestamp) {
                return `${chalk.gray(`[${timestamp}]`)} ${log_colors[level.toUpperCase()](level)} ${chalk.yellow.bold(`${name}`)}`
            },
        })
        prefix.apply(this.log.getLogger('critical'), {
            format(level, name, timestamp) {
                return chalk.red.bold(`[${timestamp}] ${level} ${name}:`)
            },
        })
        this.log.enableAll()
        this.log.info('[BROKER]','init','begin')
        
        this.gateway = []
        this.service = []
        this.net = []

        
        try{
            this.setupPubSub()
                .then(()=>this.loadServices(_options.services))
                .then(()=>this.loadGateways(_options.gateways))
                .then(()=>{
                    this.log.info('[BROKER]','init','complete')
                    this.emit('started')
                })
        }catch(e){
            this.log.error('[BROKER]','initialisation error',e)
            this.shutdown()
        }
    }
    shutdown(){
        this.log.info('[BROKER]','shutdown','begin')
        Promise.all(this.gateway.map(_gw=>
            _gw.shutdown().then(()=>
                this.findSocket(_gw.options).shutdown()
            )))
        .then(()=>{
            this.log.info('[BROKER]','shutdown','complete')
            this.emit('shutdown')
            process.exit(0)
        })
    }
    setupServiceListener(){
        this.pubsub.subscribe(SERVICE_CHANNEL, (_, serviceSchema) => {
            this.log.trace('[SUB]', 'new service', serviceSchema)
        })
        this.pubsub.subscribe(GATEWAY_CHANNEL, (_, gatewaySchema) => {
            this.log.trace('[SUB]', 'new gateway', gatewaySchema)
        })
    }
    setupPubSub(){
        throw new errors.NotImplementedError()
    }
    attachBroker(element){
        return element.init(this)
    }
    loadServices(serviceList){
        this.log.trace('[LOAD]','services')
        serviceList.forEach(serviceClass =>
            this.addService(this.node_id, serviceClass))
    }
    loadGateways(gatewayList){
        this.log.trace('[LOAD]','gateways')
        return Promise.all(gatewayList.map(gatewayClass =>
            this.addGateway(this.node_id, gatewayClass)))
    }
    addService(node, serviceClass){
        this.attachBroker(serviceClass)
        this.pubsub.publish(SERVICE_CHANNEL, serviceClass.extractSchema(), ()=>
            this.log.trace('[PUB]', node, serviceClass))
    }
    findSocket(_options){
        let _net=undefined,_net_index = this.net.findIndex(_net => _net.options.port===_options.port && _net.options.host===_options.host)
        if(_net_index===-1){
            _net = new DustSocket(this,_options)
            this.net.push(_net)
        }
        else
            _net = this.net[_net_index]
    return _net
    }
    addGateway(node, gatewayClass){
        this.attachBroker(gatewayClass)
        let _net = this.findSocket(gatewayClass.options)
        _net.attachHandler((_connection)=>{
            gatewayClass.handler(_connection)           
        })
        this.gateway.push(gatewayClass)
        this.pubsub.publish(GATEWAY_CHANNEL, gatewayClass.extractSchema(), ()=>
            this.log.trace('[PUB]', node, gatewayClass))
        
        return new Promise((resolve,reject)=>
            gatewayClass.once('started',resolve))
    }
    call(serviceRef){
        this.log.trace('[CALL]',serviceRef)
    }
}

class DustBrokerAscoltatori extends DustBroker{
    setupPubSub(){
        return new Promise((resolve, reject)=>
            ascoltatori.build((err, ascoltatore) => {
                if(err)
                    return reject(err)
                this.pubsub = ascoltatore
                this.setupServiceListener()
                return resolve()
            }))
    }
}

export {
    DustBroker,
    DustBrokerAscoltatori
}