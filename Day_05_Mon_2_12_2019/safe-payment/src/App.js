import React, { useState, useEffect } from 'react';

import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

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

  const [wallet, setWallet] = useState("");
  const [contract, setContract] = useState({});

  const [isLoading, setLoading] = useState(false);

  let web3;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    
    const currentAddress = await web3.eth.getAccounts();
    setWallet(currentAddress[0]);

    const SecurePaymentContract = new web3.eth.Contract(contract_abi, "0xADA8f07BE1F0186bb9F72876FCd4cd47637f66ad");
    setContract(SecurePaymentContract);

    console.log("Created contract connection");
  }

  const createContract = async () => {
    setLoading(true);
    console.log("Started request");

    const response = contract.methods.create(
      addressA,
      addressB,
      addressC,
      amount,
      description
    ).send({ from: wallet })
    .catch(e => {console.log(e)})
    .then((response) => {
      console.log("response: " + response)
      setLoading(false);
    });

    console.log(response);
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
                { isLoading ?
                  <Loader
                    type="ThreeDots"
                    color="#282c34"
                    height={100}
                    width={100}
                  />
                  :
                  <button type="button" onClick={() => createContract()} className="btn btn-primary">Submit</button>
                }
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
