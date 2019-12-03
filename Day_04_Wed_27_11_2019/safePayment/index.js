const Web3 = require('web3');
const contract_abi = require('./contract_abi.json');

const contractAddress = "0xADA8f07BE1F0186bb9F72876FCd4cd47637f66ad";
let web3;
let SecurePaymentContract;

const init = async () => {
  console.log("Initilizing...");
  
  web3 = new Web3('https://ropsten.infura.io');  
  const account = web3.eth.accounts.privateKeyToAccount("0xD3EE962D96B7F4B581F0DF0393929CA8B5F16C05EA10EE4CC475BDAFB3362529");
  
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  
  SecurePaymentContract = new web3.eth.Contract(contract_abi, contractAddress);
};

const create = async () => {
  console.log("Creating Contract");

  SecurePaymentContract.methods.create(
    "0xE7abc2df8f550BF109874CD6450a4eF3EbA711Dd",
    "0xD45c3581a0250DBeD87943d77711632DD0925201",
    "0xAA9f523547618eca5ae6ee208D1aF03A19Cbf518",
    50000,
    "test").send({
      from: web3.eth.defaultAccount,
      gas: 4000000
  })
  .then((result) => console.log(result))
  .catch((error) => console.log(error));

};

const retrieve = async (object) => {
  console.log("----")
  console.log(object)
  const decoded = web3.eth.abi.decodeParameters(contract_abi, object.data);
  console.log(decoded)
}

const start = async () => {
  await init();
  await create();  

  SecurePaymentContract.events.allEvents().on('data', function(event) {
    console.log(event);
  });
};

start();
process.stdin.resume(); // prevents nodejs from exiting