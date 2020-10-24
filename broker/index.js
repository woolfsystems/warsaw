import chalk from 'chalk'
import prefix from 'loglevel-plugin-prefix'

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
    constructor(_options){
        this.options = _options
        this.socket = net.createServer({ pauseOnConnect: true})
        this.socket.on('lookup',(parms)=>{
            console.log('LOOKUP',parms)
        })
        this.socket.listen({...this.options, exclusive: true},()=>{
            console.log("LISTENING",this.options)
        })
        this.socket.on('error', (err) => {
            throw err
        }) 
    }
    attachHandler(_handler){
        this.socket.on('connection',_handler)
    }
}
class DustBroker{
    constructor(serviceList = [], gatewayList = []){
        this.log = loglevel
        prefix.reg(this.log)
        prefix.apply(this.log, {
            nameFormatter(){
                return 'DUST'
            },
            format(level, name, timestamp) {
                return `${chalk.gray(`[${timestamp}]`)} ${log_colors[level.toUpperCase()](level)} ${chalk.yellow.bold(`[${name}]`)}`
            },
        })
        prefix.apply(this.log.getLogger('critical'), {
            format(level, name, timestamp) {
                return chalk.red.bold(`[${timestamp}] ${level} ${name}:`)
            },
        })
        this.log.enableAll()

        this.log.info('[BROKER]','init')
        
        this.gateway = []
        this.service = []
        this.net = []
        
        try{
            this.setupPubSub().then(()=>
                this.loadServices(serviceList)).then(()=>
                this.loadGateways(gatewayList)).then(()=>{
                    setTimeout(()=>
                    this.gateway.forEach(_g=>_g.shutdown()),3000)
                })
        }catch(e){
            this.log.error('[BROKER]','initialisation error',e)
            this.shutdown()
        }
    }
    shutdown(){
        this.log.warn('[BROKER]','shutting down')
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
        element.init(this)
    }
    loadServices(serviceList){
        this.log.trace('[LOAD]','services')
        serviceList.forEach(serviceClass =>
            this.addService(this.node_id, serviceClass))
    }
    loadGateways(gatewayList){
        this.log.trace('[LOAD]','gateways')
        gatewayList.forEach(gatewayClass =>
            this.addGateway(this.node_id, gatewayClass))
    }
    addService(node, serviceClass){
        this.attachBroker(serviceClass)
        this.pubsub.publish(SERVICE_CHANNEL, serviceClass.extractSchema(), ()=>
            this.log.trace('[PUB]', node, serviceClass))
    }
    findSocket(_options){
        let _net=undefined,_net_index = this.net.findIndex(_net => _net.options.port===_options.port && _net.options.host===_options.host)
        if(_net_index===-1){
            _net = new DustSocket(_options)
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