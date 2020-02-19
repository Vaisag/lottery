//To run this, enter 'node deploy.js' in cmd
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

//HDWalletprovider is used as a provider here
//and there will be two inputs to its object
//1.account mnemonic of our the account which is going to spend
//2.infura API link
const provider = new HDWalletProvider(
	"illness west clog humble just ritual purchase velvet kite monkey window bracket",
	"https://rinkeby.infura.io/v3/0a3b64d456e144bb85b771e4c1ce00f6"
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();
	console.log("Attempting to deploy from account", accounts[0]);

	const result = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data: bytecode })
		.send({ gas: "1000000", from: accounts[0] });

	console.log(interface);
	console.log("Contract deployed to", result.options.address);
};
deploy();
