import {DustBrokerAscoltatori,DustService,DustGatewaySocketIO,DustGatewayExpressStatic} from './index.js'

let broker = new DustBrokerAscoltatori({
    services: [
        new DustService()
    ],
    gateways: [
        new DustGatewaySocketIO({port: 4000, host: 'localhost'}),new DustGatewayExpressStatic({port: 3000, host: 'localhost', serve: 'public'})
    ]
})
