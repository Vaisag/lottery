import Web3 from 'web3';

//window.web3 will take the copy of web3 which is coming from metamask library
//refer notes in note
//currentProvider is the provider which is coming from metamask library as well
//this provider is pre configured to connect to rinkeby 
//and has access to our addresses, public and private keys
const web3 = new Web3(window.web3.currentProvider);


export default web3;