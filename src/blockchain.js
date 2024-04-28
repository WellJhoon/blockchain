const Block = require('./block');
const SHA256 = require('crypto-js/sha256');
class Blockchain {
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    async initializeChain() {
        if(this.height === -1) {
            const block = new Block({data: 'SUN'});
          await  this.addBlock(block);
        }
    }

    addBlock(block){
        let self = this;
        return new Promise(async (resolve, reject) => {
            block.height = self.chain.length;
            block.time = new Date().getTime().toString();
            if(self.chain.length > 0) {
                block.previousBlockHash = self.chain[self.chain.length - 1].hash;
            }
            let errros = await self.validateChain();
            if(errros.length > 0) {
                reject(new Error('The chain is not valid: ', errros));
            }
            block.hash = SHA256(JSON.stringify(block)).toString();
            self.chain.push(block);
            resolve(block);
        });
    }

    validateChain() {
        let self = this;
        const errros = [];
        

        return new Promise(async (resolve, reject) => {
            self.chain.map(async(block) => {
                try {
                    let isValid = await block.validate();
                    if(!isValid) {
                        errros.push(new Error(`Block ${block.height} is not valid`));
                    }
                } catch (err) {
                    reject(err);
                }
            });
            resolve(errros);
        });
    }


    print() {
        let self = this;
        for (let block of self.chain) {
            console.log(block.toString());
        }
    }
}



module.export = Blockchain;