/*const ChainUtil = require('../chain-util');
class Transaction{
  constructor(){
  	this.id = ChainUtil.id();
  	this.input = null;
  	this.outputs = [];
  }

 update(senderWallet,recipient,amount)
 {
 	const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

 	if(amount > senderOutput.amount){
 		console.log(`Amount ${amount} exceeds the balance.`);
 	    return;
 	   }
 	   
 	  senderOutput.amount = senderOutput.amount - amount;
 	  this.outputs.push({amount, address: recipient});  
 	  Transaction.signTransaction(this, senderWallet);

 	  return this;
 }
  static newTransaction(senderWallet,recipient,amount)
  {
  	const transaction = new this();

  	if(amount > senderWallet.balance){
  		console.log(`Amount: ${amount} exceeds the sender balance`);
  	    return;
  	}

  	transaction.outputs.push(...[
      {amount: senderWallet - amount , address: senderWallet.publicKey},
      {amount, address: recipient}
  		]);

    Transaction.signTransaction(transaction,senderWallet);
  	return transaction;
  }

  static signTransaction(transaction,senderWallet){
  	transaction.input = {
  		timestamp : Date.now(),
  		amount : senderWallet.balance,
  		address : senderWallet.publicKey,
  		signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
  	}
  }

  static verifyTransaction(transaction){
  	return ChainUtil.verifySignature(transaction.input.address,transaction.input.signature,ChainUtil.hash(transaction.outputs));
  }

}

module.exports = Transaction;
////blablabla

const ChainUtil = require('../chain-util');
//const { MINING_REWARD } = require('../config');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  // unique to this implementation:
  update(senderWallet, recipient, amount) {
    // update the sender's output amount based off the new receiving output
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;

    this.outputs.push({ amount, address: recipient });

    // resign the updated transaction, will only work from the original sender
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    const verified = ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    )

    return verified;
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }

  // sender is an entire wallet class
  // recipient is the public key of the recipient
  static newTransaction(senderWallet, recipient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    // subtract the balance from the sender
    const senderAmount = senderWallet.balance - amount;

    // TODO: add transaction fee
    return Transaction.transactionWithOutputs(senderWallet, [
      { amount: senderAmount, address: senderWallet.publicKey },
      { amount, address: recipient }
    ]);
  }

  //static rewardTransaction(minerWallet) {
    //return Transaction.transactionWithOutputs(minerWallet, [{
      //amount: MINING_REWARD, address: minerWallet.publicKey
    //}]);
  
}

module.exports = Transaction;
*/

const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  // unique to this implementation:
  update(senderWallet, recipient, amount) {
    // update the sender's output amount based off the new receiving output
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
    console.log("amount after find->",senderOutput.amount);
    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }
    console.log("Old sender amount is->",senderOutput.amount);
    senderOutput.amount = senderOutput.amount - amount;
    console.log("The new sender amount is->",senderOutput.amount);
    console.log("pushing");
    this.outputs.push({ amount, address: recipient });

    // resign the updated transaction, will only work from the original sender
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    const verified = ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    )

    return verified;
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }

  // sender is an entire wallet class
  // recipient is the public key of the recipient
  static newTransaction(senderWallet, recipient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    // subtract the balance from the sender
    const senderAmount = senderWallet.balance - amount;

    // TODO: add transaction fee
    return Transaction.transactionWithOutputs(senderWallet, [
      { amount: senderAmount, address: senderWallet.publicKey },
      { amount, address: recipient }
    ]);
  }

  static rewardTransaction(minerWallet) {
    return Transaction.transactionWithOutputs(minerWallet, [{
      amount: MINING_REWARD, address: minerWallet.publicKey
    }]);
  }
}

module.exports = Transaction;