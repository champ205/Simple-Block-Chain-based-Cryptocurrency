const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');


class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Difficulty: ${this.difficulty}
      Nonce     : ${this.nonce}
      Data      : ${this.data}`;
  }

  static genesis() {
    return new this('Genesis time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let hash, timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }
}

module.exports = Block;

/*const SHA256 = require('crypto-js/sha256');
const{ DIFFICULTY } = require('../config')
class  Block{
  constructor(timestamp,lasthash,hash,data,nonce){
  this.timestamp = timestamp;
  this.lastHash = lasthash;
  this.hash = hash;
  this.data = data;
  this.nonce = nonce;
  } 
  
  toString(){
     return `Block-
      TimeStamp->${this.timestamp}
      LastHash-> ${this.lasthash.substring(0,10)}
      Hash->     ${this.hash.substring(0,10)}
      Data->     ${this.data}
      Nonce->    ${this.nonce}
      `;       
    }
    
    static genesis(){
     return new this("Genesis Time","------","hhbiku12ui",[],0);
    }
    
    static mineBlock(lastBlock,data){
     let hash;
     let timestamp;
     let substring;
     const lastHash = lastBlock.hash;
     let nonce = 0;
     do{
        nonce++;
        timestamp = Date.now();
        const hash = Block.hash(timestamp,lastHash,data,nonce,DIFFICULTY);
        substring = hash.substring(0,DIFFICULTY); 
     }while(substring !== '0'.repeat(DIFFICULTY));

     
     return new this(timestamp,lastHash,hash,data,nonce);
    }
    
    static hash(timestamp,lastHash,data,nonce,difficulty){
      return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }
    
    static blockHash(block){
       const{ timestamp,lastHash,data,nonce} = block;
       return Block.hash(timestamp,lastHash,data,nonce);
       
     }
     }
     
     module.exports = Block;

     */