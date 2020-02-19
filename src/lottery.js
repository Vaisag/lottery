// goal of this is to set up a local copy of contract
// that refers to correct address in the rinkeby test network
import web3 from "./web3";

//ABI and address of the deployed contract is taken from the lottery contract deployment
const address = "0x30bCcb5103364b3A88060957624653E46A0804c3";

//JSPrettier package is used to format the ABI which is taken from the lottery contract
const abi = [
	{
		constant: true,
		inputs: [],
		name: "manager",
		outputs: [{ name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [],
		name: "pickWinner",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "getPlayers",
		outputs: [{ name: "", type: "address[]" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [],
		name: "enter",
		outputs: [],
		payable: true,
		stateMutability: "payable",
		type: "function"
	},
	{
		constant: true,
		inputs: [{ name: "", type: "uint256" }],
		name: "players",
		outputs: [{ name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "lastWinner",
		outputs: [{ name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "constructor"
	}
];


//this will create a new local copy of the contract using the abi and address we provide
export default new web3.eth.Contract(abi, address);