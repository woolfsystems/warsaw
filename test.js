import {DustBroker,DustService} from './index.js'

let broker = new DustBroker([new DustService()])
broker.call('test.ping')