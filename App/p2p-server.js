const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

/*const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS'
}; */

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.sockets = [];
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));
    this.connectToPeers();
    console.log(`Listening for peer to peer connections on: ${P2P_PORT}`);
  }

  connectToPeers() {
    // peers are declared when the server is started through an environment variable.
    peers.forEach(peer => {
      // this actually makes the websocket connection
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  sendChain(socket) {
    socket.send(JSON.stringify({chain: this.blockchain.chain }));
    //socket.send(JSON.stringify(this.blockchain.chain));
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({ type: MESSAGE_TYPES.transaction, transaction }));
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      this.blockchain.replaceChain(data);

      /*switch(data.type) {
        case MESSAGE_TYPES.chain:
          // const receivedChain = JSON.parse(message);
          // attempt to replace the original chain with the received chain
          // the built-in functionality will actually replace the chain securely
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          console.log('New transaction', data.transaction);
          // Create a transaction with the wallet to actually update it
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
      }*/
    });
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  /*broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  broadcastClearTransactions() {
    this.sockets.forEach(socket => socket.send(JSON.stringify({
      type: MESSAGE_TYPES.clear_transactions
    })));
  }*/
}

module.exports = P2pServer;
/*const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const PEERS = process.env.PEERS?process.env.PEERS.split(','):[];

class P2pServer{
   constructor(blockchain){
	this.blockchain = blockchain;
	this.sockets = [];
 
       }
   listen(){
          const server = new Websocket.Server({port: P2P_PORT});
           server.on('connection', socket => this.connectSocket(socket));
           console.log(`listening on peer-to-peer server on port ${P2P_PORT}`);

           this.connectToPeers();

       }
   connectSocket(socket){
   	       this.sockets.push(socket);
   	       console.log('socket connected');
   	       this.messageHandler(socket);
   	       this.sendChain(socket);    
   }    
   connectToPeers(){

   	PEERS.forEach(peer =>{
   		const socket = new Websocket(peer);
   		socket.on('open', () => this.connectSocket(socket));	
   	});
   }

   messageHandler(socket)
   {
   	socket.on('message', message =>{
     const data = JSON.parse(message);
     
     this.blockchain.replaceChain(data);

   	});
   }
   
   sendChain(socket)
   {
   	socket.send(JSON.stringify(this.blockchain.chain));
   }

   syncChains(){
   	this.sockets.forEach(socket =>this.sendChain(socket));
   }

}

module.exports = P2pServer;
*/