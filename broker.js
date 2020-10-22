const ascoltatori = require('ascoltatori')
const errors = require('common-errors')

const SERVICE_TOPIC = 'service'

class DustBroker{
    constructor(){
        this.setupPubSub().then(()=>
            this.loadServices())
    }
    setupServiceListener(){
        this.pubsub.subscribe(SERVICE_TOPIC, function(_,serviceSchema) {
            console.log('[sub]','new service',serviceSchema)
        })
    }
    setupPubSub(){
        throw new errors.NotImplementedError("PubSub handler 'setupPubSub' has not been implemented.")
    }
    loadServices(){
        this.addService(this.node_id,{name: 'test', actions: ['blah']})
    }
    addService(node, serviceSchema){
        this.pubsub.publish(SERVICE_TOPIC, serviceSchema, function() {
            console.log('[pub]')
        })
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

new DustBrokerAscoltatori()