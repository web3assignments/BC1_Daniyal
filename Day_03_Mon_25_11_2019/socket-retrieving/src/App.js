import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const server = "wss://mainnet.infura.io/ws/66d74f5ff1cc413e841f3f1de4152262";
  const [blocks, setBlocks] = useState([]);

  useEffect(() => connectToSocket(), []);

  function connectToSocket() {

    var socket = new WebSocket(server);
   
    socket.onopen = function (event) {
      const request = JSON.stringify({ "id": 1, "method": "eth_subscribe", "params": ["newHeads"] });
      console.log(`Connection opened, sending: ${request}`);
      socket.send(request);
    };

    socket.onmessage = function (event) {
      var data = JSON.parse(event.data);
      
      if (data.params != null) {
        setBlocks(blocks => [...blocks, {
          number: data.params.result.number,
          timestamp: data.params.result.timestamp,
          hash: data.params.result.hash
        }]);
      }
    }

    socket.onerror = function (error) {
      console.log(`[error] ${error.message}`);
    };

  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Blocks:</h1>
        <div className="container">
          <div className="row">
            {console.log(blocks)}
            {blocks.map((block) => (
              <div className="col-12 col-md-3 p-1">
                <div className="block">
                  <h2>{block.number}</h2>
                  <hr/>
                  <p>{block.hash}</p>
                  <b>{block.timestamp}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
