import React, { Component } from "react";
import SecurePaymentContract from "./contracts/SecurePayment.json";
import getWeb3 from "./getWeb3";

import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

import Range from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    isLoading: false,
    addressA: null, 
    addressB: null, 
    addressC: null, 
    amount: 0, 
    description: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SecurePaymentContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SecurePaymentContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  createContract = async () => {
    const { accounts, contract, addressA, addressB, addressC, amount, description } = this.state;

    this.setState({ isLoading: true });

    await contract.methods.create(
      addressA,
      addressB,
      addressC,
      amount,
      ""
    ).send({ from: accounts[0] })
      .catch(e => { console.log(e) })
      .then((response) => {
        console.log("response: " + response);

        this.setState({ isLoading: false });
      });

    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

  
  render() {
    const { addressA, addressB, addressC, amount, isLoading } = this.state;

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <div className="container my-auto h-100">
          <div className="row my-auto ">
            <div className="col-12 col-lg-7 text-center">
              <div className="m-4 p-4">
                <h1>Secure Payment</h1>
                <img src="/safe.gif" alt="Safe" />
              </div>
            </div>

            <div className="col-12 col-lg-5 ">
              <div className="box m-4 p-4">
                <form>
                  <h3 className="mb-4">Create the contract</h3>

                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Address A</label>
                    <input type="text" name="walletA" value={addressA} onChange={(v) => this.setState({ addressA: v.target.value})} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Your address" />
                    <small id="emailHelp" className="form-text text-muted"> Your ethereum wallet address.</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Address B</label>
                    <input type="text" name="walletB" value={addressB} onChange={(v) => this.setState({ addressB: v.target.value})} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Receiver's address" />
                    <small id="emailHelp" className="form-text text-muted">The receiver's address.</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Address C</label>
                    <input type="text" name="walletC" value={addressC} onChange={(v) => this.setState({ addressC: v.target.value})} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Verifier address" />
                    <small id="emailHelp" className="form-text text-muted">The validator's address.</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputNumber">Amount</label>
                    <Range
                      min={0}
                      max={100000}
                      value={amount}
                      onChange={values => this.setState({amount: values})}
                    />
                    <div className='value'>{amount}</div>

                  </div>
                  <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                  </div>
                  {isLoading ?
                    <Loader
                      type="ThreeDots"
                      color="#282c34"
                      height={100}
                      width={100}
                    />
                    :
                    <button type="button" onClick={() => this.createContract()} className="btn btn-primary">Submit</button>
                  }
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
