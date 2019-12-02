import React, { useState, useEffect } from 'react';

import Range from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'

import Web3 from 'web3';

import './App.css';
import contract_abi from './contract_abi.json'

function App() {  
  const [amount, setAmount] = useState(0);
  const [addressA, setaddressA] = useState("");
  const [addressB, setaddressB] = useState("");
  const [addressC, setaddressC] = useState("");
  const [description, setDescription] = useState("");

  let SecurePaymentContract;
  let web3;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();

    SecurePaymentContract = new web3.eth.Contract(contract_abi, "0x0a3c808e444447f6e41074151e4AEb63774D15AB");
    
    console.log("Created contract connection");
  }

  const createContract = () => {
    console.log("Started request");

    web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    SecurePaymentContract = new web3.eth.Contract(contract_abi, "0x0a3c808e444447f6e41074151e4AEb63774D15AB");


    const response = SecurePaymentContract.methods.create(
      addressA,
      addressB,
      addressC,
      amount,
      description
    ).send({ from: web3.eth.defaultAccount }).catch(e => {console.log(e)});

    console.log("response: " + response)
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
                  <input type="text" value={addressA} onChange={v => setaddressA(v.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Your address" />
                  <small id="emailHelp" className="form-text text-muted"> Your ethereum wallet address.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Address B</label>
                  <input type="text" value={addressB} onChange={v => setaddressB(v.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Receiver's address" />
                  <small id="emailHelp" className="form-text text-muted">The receiver's address.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Address C</label>
                  <input type="text" value={addressC} onChange={v => setaddressC(v.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Verifier address" />
                  <small id="emailHelp" className="form-text text-muted">The validator's address.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputNumber">Amount</label>
                   <Range
                    min={0}
                    max={100000}
                    value={amount}
                    onChange={values => setAmount(values)}
                  />
                  <div className='value'>{amount}</div>

                </div>
                <div className="form-group form-check">
                  <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                  <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div>
                <button type="button" onClick={() => createContract()} className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
