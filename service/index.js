export class DustService{
    constructor(){
        this.name = 'test'
    }
    init(_broker){
        this.broker = _broker
    }
    extractSchema(){
        return {
            name: this.name,
            actions: ['ping','pong']
        }
    }
}