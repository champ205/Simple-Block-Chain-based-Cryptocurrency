const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const P2pServer = require('./p2p-server');
//const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const app = express();
const p2pServer = new P2pServer(bc);
//const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

/*app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);

  res.redirect('/blocks');
});

app.get('/balance', (req, res) => {
  res.json({ balance: wallet.calculateBalance(bc) });
});*/

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  p2pServer.syncChains();
  console.log(`New block added:${block.toString()} `);

  res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
  console.log("hello!");
});

app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount,bc,tp);

  // store transactions on the block itself.
//  p2pServer.broadcastTransaction(transaction);

  res.redirect('/transactions');
});
/*
app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.get('/peers', (req, res) => {
  // res.json({
  //   peers: p2pServer.sockets.map(socket => socket._socket.address())
  // });
  res.json({ peers: p2pServer.sockets.length });
});

// app.post('/addPeer');
*/
app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));
p2pServer.listen();

// module.exports = bc;

/*
const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../Blockchain');
const P2pServer = require('./p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc  = new Blockchain();
const p2pServer = new P2pServer(bc);
app.use(bodyParser.json());

app.get('/blocks', (req,res)=>{
  res.json(bc.chain);

});

app.post('/mine',(req,res) =>{
	const block = bc.addBlock(req.body.data);
	console.log(`New Block added:`);
	p2pServer.syncChains();
	res.redirect('/blocks');
});
if(HTTP_PORT == 3001)
{
	console.log(`current port is->${HTTP_PORT}`)
}
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
*/