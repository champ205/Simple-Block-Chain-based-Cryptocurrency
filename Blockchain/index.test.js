const Blockchain = require('./index');
const Block = require('./block');

describe('blockchain', () => {
  let bc,bc2;
  beforeEach(() =>{
   bc = new Blockchain();
   bc2 = new Blockchain();
  });


it('starts with the genesis function', () =>{
  expect(bc.chain[0]).toEqual(Block.genesis());
});

it('adds a new block',() =>{
  const data = 'foo';
  bc.addBlock(data);
  
  expect(bc.chain[bc.chain.length-1].data).toEqual((data)); 
  
});

it('validates a valid chain', () => {
   bc2.addBlock('foo');
   expect(bc.isValidChain(bc2.chain)).toBe(true);
   //expect(bc.isValidChain(bc2.chain)).toBe(true);
});

it('it invalidates a chain with a corrupt genesis block', () => {
  bc2.chain[0].data = 'Bad data';
  expect(bc.isValidChain(bc2.chain)).toBe(false);
});

it('invalidates a corrupt chain', () => {
  bc2.addBlock('foo');
  bc2.chain[1].data = 'Not foo';
  expect(bc.isValidChain(bc2.chain)).toBe(false);
});

it('it replaces the chainn with a valid chain', () => {
  bc2.addBlock('goo');
  bc.replaceChain(bc2.chain);
  expect(bc.chain).toEqual(bc2.chain);

});

it('it does not replace the chain with one of less than or equal tot the length', () => {
   bc.addBlock('foo');
   bc.replaceChain(bc2.chain);
   expect(bc.chain).not.toEqual(true);

});
});