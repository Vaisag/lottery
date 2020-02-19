pragma solidity ^0.4.17;

contract Lottery{
    address public manager;
    address[] public players;
    address public lastWinner;
    
    function Lottery() public{
       //msg is an object which has details about the account and the transaction.
       //More details about msg in notes
        manager = msg.sender;
    }
    function enter() public payable {
        // require() will take in a boolean expression, if the 
        //expression is false, then the function is exited.
        //msg.value will have the amount(in wei) sent along with the transaction
        //ether keyword will convert the value into ether and then compare it
        require(msg.value > .01 ether);
        players.push(msg.sender);
        
    }
    //there is no real random umber generator in solidity, so we use sha3 algorithm to 
    //generate pseudo random number using block difficulty, current time and addresses of players
    function random() private view returns(uint) {
        //the sha3 algorithm will return a hex value, to convert this to uint, just use the uint function around it
        return uint(keccak256(block.difficulty, now, players));
    }
    function pickWinner() public restricted{
        //only manager should be able to pick the winner
        //we are using function modifier 'restricted' here
        //using a modulo operator to find out the index of the pickWinner
        //this is just a random technique used in this contract, we may use any other technique
        //random() will return the random number
        //players.length will give the number of players in the players array
        uint index = random() % players.length ;
        //addresses in solidity is essentially an object which has various internal methods tied to it
        //transfer() is one such method. This method will take some amount of ether from contract and transfer it
        //to the address which is used to call the method
        //this.balance will send all of the amount in the cotract to the address
        //'this' refers to the instance of the current contract 
        players[index].transfer(this.balance);
        lastWinner = players[index];
        //in order for us to restore the contract to have its initial settings, the players array has to be initialized
        //initialize the players as a dynamic array with address type and intial size = 0
        players = new address[](0);
    }
    //function modifier will modify a function to have all the code from a function pasted into 
    //the modifier wherever the underscore is written
    //modifier can have any name but has to be specified in the 
    //function declaration line
    //modifiers are used as a solution for repetitive code
    modifier restricted(){
        require( msg.sender == manager );
        _;
    }
    function getPlayers() public view returns(address[])
    {
        return players;
    }
}