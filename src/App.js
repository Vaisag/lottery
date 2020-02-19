import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3.js";
import lottery from "./lottery";

class App extends Component {
  /*  constructor(props) {
    super(props);

    this.state = { manager: "" };
  }*/
  //The below code is equivalent to the above commented out code - this is a new ES6 code
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    winner: ""
  };
  //ComponentDidMount() is automatically called when component renders
  async componentDidMount() {
    //since we are using metamask's provider, we dont have to specify the account from which we are calling methods
    //as the provider will have a default account from metamask already
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const winner = await lottery.methods.lastWinner().call();

    this.setState({ manager, players, balance, winner });
  }

  //functions usually are manually binded in the render function
  //but version of babble here has the below syntax which will avoid the need for binding inside render
  //value of 'this' will be equal to our component
  onSubmit = async event => {
    //the below line will avoid form from submitting itself
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });
    this.setState({ message: "You have been entered" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success..." });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: "A winner has been picked " });
  };

  render() {
    return (
      <div>
        <h2> Lottery Contract </h2>
        <p>
          This Contract is managed by {this.state.manager}. There are currently{" "}
          {this.state.players.length} people entered competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4> Want to try your luck? </h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4> Ready to pick a winner?</h4>
        <button onClick={this.onClick}> Pick a winner!</button>
        <hr />
        <h1>{this.state.message}</h1>
        <h2>Last Winner was {this.state.winner}</h2>
      </div>
    );
  }
}

export default App;
