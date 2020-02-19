//cannot require for solidity files directly in js files, we need to get the actual source code itself into the compile.js file
//path and fs are standard modules, so we dont have to npm install them in the terminal
//path will help us build directory path from compile.js to Lottery.sol
const path = require("path");
const fs = require("fs");
const solc = require("solc");

//__dirname will point to the current directory
//lotteryPath is used to store the path to Lottery.sol
const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
//read the raw source code
//utf8 is the encoding of the file lottery.sol
//source variable is used to store the actual code itself
const source = fs.readFileSync(lotteryPath, "utf8");

//in order for the code to be used across the project, the bytecode and interface/ABI(both are results of compilation)
//have to be saved into module.exports
//notice we only pick the contracts.:Lottery object from the compiler listing, this is because
//we only require that to be used across the project
// number of contracts we are attempting to compile is passed on to the solc.compile
module.exports = solc.compile(source, 1).contracts[":Lottery"];



