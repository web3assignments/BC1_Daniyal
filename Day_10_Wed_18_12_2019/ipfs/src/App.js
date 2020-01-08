import React, { useState, useEffect } from 'react';

import IpfsHttpClient from 'ipfs-http-client'
import Buffer from 'buffer';

import logo from './logo.svg';
import './App.css';

function App() {
  const [ipfs, setIpfs] = useState(0);
  const [file, setFile] = useState(0);
  const [id, setId] = useState("");
  const [hash, setHash] = useState("");

  useEffect(() => {
    setIpfs(IpfsHttpClient('https://ipfs.infura.io:5001'));
  }, [])

  const uploadFile = (eventFile) => {
    setFile(eventFile);
  }

  const uploadToIpfs = async (e) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = async () => {
      const fileBuf = Buffer.Buffer(reader.result)

      console.log(`Adding file to ipfs via Infura`);

      const hash = await ipfs.add(fileBuf).catch(console.log); 
      setHash(hash[0].hash);

      console.log(`Hash ${hash[0].hash}`);
    }
  }

  const getFile = async (e) => {
    e.preventDefault();

    console.log(id);
    console.log(await ipfs.cat(id));
    window.location.href = `https://ipfs.io/ipfs/${id}`
  }

  const renderHash = () => {
    
    return (
      <div className="alert alert-success">
        {hash}
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <div className="container">
          {hash && renderHash()}
          <div className="row">
            <div className="col-12 col-md-6">
              <form>
                <p><b>Choose a file</b></p>

                <div className="form-group">
                  <input className="form-control-file" type="file" onChange={(e) => uploadFile(e.target.files[0])} />
                </div>

                <button className="btn btn-primary" type="button" onClick={(e) => uploadToIpfs(e)} >
                  Upload File
                </button>
              </form>
            </div>
            
            <div className="col-12 col-md-6">
            <form>
              <p><b>Get a file from ipfs</b></p>
              
              <div className="form-group">
                <input type="text" value={id} onChange={v => setId(v.target.value)} className="form-control" placeholder="IPFS id" />
              </div>

              <button className="btn btn-primary" type="button" onClick={(e) => getFile(e)} >
                Get File
              </button>
            </form>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
