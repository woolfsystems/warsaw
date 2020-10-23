export class DustService{
    constructor(){
        this.name = 'test'
    }
    extractSchema(){
        return {
            name: this.name,
            actions: ['ping','pong']
        }
    }
}