import ascoltatori from 'ascoltatori'
import errors from 'common-errors'

const SERVICE_CHANNEL = '__SERVICE__'
const CALL_CHANNEL = '__CALL__'

class DustBroker{
    constructor(serviceList = []){
        this.setupPubSub().then(()=>
            this.loadServices(serviceList))
    }
    setupServiceListener(){
        this.pubsub.subscribe(SERVICE_CHANNEL, function(_,serviceSchema) {
            console.log('[sub]','new service',serviceSchema)
        })
    }
    setupPubSub(){
        throw new errors.NotImplementedError("PubSub handler 'setupPubSub' has not been implemented.")
    }
    loadServices(serviceList){
        serviceList.forEach(serviceClass =>
            this.addService(this.node_id, serviceClass))
    }
    addService(node, serviceClass){
        this.pubsub.publish(SERVICE_CHANNEL, serviceClass.extractSchema(), function() {
            console.log('[pub]')
        })
    }
    call(serviceRef){
        console.log('[call]',serviceRef)
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