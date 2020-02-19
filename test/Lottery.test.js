const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async ()=>{
	accounts = await web3.eth.getAccounts();
	lottery =  await new web3.eth.Contract(JSON.parse(interface))
	.deploy({data: bytecode})
	.send({from: accounts[0], gas: '1000000'});
});
 
describe('Lottery Contract', ()=>{

	it('deploys a Contract', ()=>{
		assert.ok(lottery.options.address);
	});
	it('allows one account to enter', async () =>{

		await lottery.methods.enter().send({
			from: accounts[0], 
			value: web3.utils.toWei('0.02', 'ether') //this will convert ether to wei
		});
		const players = await lottery.methods.getPlayers().call({
			from:accounts[0]
		});
		assert.equal(accounts[0],players[0]); //always first argument should be what we expect it to be, 
											//second argument should be what it is
		assert.equal(1,players.length);
	});
	it('allows multiple accounts to enter', async () =>{
		await lottery.methods.enter().send({
			from: accounts[0], 
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[1], 
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[2], 
			value: web3.utils.toWei('0.02', 'ether')
		});
		const players = await lottery.methods.getPlayers().call({
			from:accounts[1]
		});
		assert.equal(accounts[0],players[0]);
		assert.equal(accounts[1],players[1]);
		assert.equal(accounts[2],players[2]);
		assert.equal(3, players.length);

	});
	it('requires a minimum amount of ether to enter', async () =>{
		//try-catch can be used to automatically catch errors thrown by asynchronous function calls	
		try{
		await lottery.methods.enter().send({
			from:accounts[0],
			value: 0
		});
		//assert(false) will always throw error, but if the above async call fails, it will go into catch
		assert(false);//this line of code will not run if there was an error in the async call above.
} catch(err){
//assert will check for truthiness, if err has any values(which will happen only if there was any error 
//in the async call in the try segment)
	assert(err);
}

	});
	it('only manager can call pickWinner', async () =>{
		try{
		await lottery.methods.pickWinner().send({
			from:accounts[1]
		});
		assert(false);
} catch(err){
		assert(err);
	}
	});
	it('sends money to the winner and resets the players array', async () =>{
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('2', 'ether')
		});
		//getBalance() will return the amount of wei an account controls
		const initialBalance = await web3.eth.getBalance(accounts[0]);
		const winner = await lottery.methods.pickWinner().send({
			from: accounts[0]
		});
		const finalBalance = await web3.eth.getBalance(accounts[0]);
		const difference = finalBalance - initialBalance;
		assert(difference > web3.utils.toWei('1.8', 'ether'));
		const players= await lottery.methods.getPlayers().call({
			from:accounts[0]
		});
		assert.equal(0,players.length);
		const lotteryBalance = await web3.eth.getBalance(lottery.options.address);
		assert.equal(0,lotteryBalance);

	});
});