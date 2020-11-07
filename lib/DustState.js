import {EventEmitter} from 'events'

const DUST_STATE_INITIAL = Symbol('Loading')
const DUST_STATE_RUNNING = Symbol('Running')
const DUST_STATE_TERMINATING = Symbol('Terminating')
const DUST_STATE_SHUTDOWN = Symbol('Shutdown')

class DustState extends EventEmitter{
    constructor(){
        super()
        this._state = DUST_STATE_INITIAL
    }
    set state(_v){
        ((typeof this.log!=='undefined' && this.log) || (typeof this.broker!=='undefined' && this.broker.log) || console)
            .info(`[${this.name}]`,'state',...(this._state?[this._state,'=>',_v]:[_v]))
        this._state = _v
        this.emit('state',_v)
    }
    get state(){
        return this._state
    }
}

export {
    DustState,

    DUST_STATE_INITIAL,
    DUST_STATE_RUNNING,
    DUST_STATE_TERMINATING,
    DUST_STATE_SHUTDOWN
}