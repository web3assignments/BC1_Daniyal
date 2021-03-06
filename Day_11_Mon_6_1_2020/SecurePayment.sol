pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import "github.com/provable-things/ethereum-api/provableAPI.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/ownership/Ownable.sol";

contract SecurePayment is usingProvable, Ownable {
  struct Person {
    address payable walletAddress;
    bool verified;
  }

  struct Transaction {
    Person personA;
    Person personB;
    Person verifier;
    uint256 amount;
    bool payedIn;
    bool payedOut;
    string description;
  }

  uint totalTransactions;
  mapping (uint => Transaction) public transactions;

  event Created(address a, address b, uint transactionId);
  event PayedOut(address a, address b, uint transactionId);
  event LogQueryProvable(string description);
  event LogNewKrakenPriceTicker(string price);
  
  constructor() public Ownable() {
  
  }
  
  function create(address payable _personA,
                  address payable _personB,
                  address payable _middleMan, 
                  uint256 _amount,
                  string memory _description) public isNotSame(_personA, _personB) returns (uint) {

    Transaction memory transaction = Transaction( 
                                        Person(_personA, false), 
                                        Person(_personB, false), 
                                        Person(_middleMan, false), 
                                        _amount,
                                        false,
                                        false,
                                        _description);

    totalTransactions++;
    transactions[totalTransactions] = transaction;

    
    emit Created(_personA, _personB, totalTransactions);
    return totalTransactions;
  }

  modifier isReady(uint transactionId) {
    require(
      transactions[transactionId].personA.verified && 
      transactions[transactionId].personB.verified &&
      transactions[transactionId].verifier.verified);
    _;
  }

  modifier canPayout(uint transactionId) {
    require(
      transactions[transactionId].payedIn &&
      transactions[transactionId].verifier.walletAddress == msg.sender &&
      !transactions[transactionId].payedOut);
    _;
  }

  modifier isNotSame(address a, address b) {
    require(a != b, "Address can't be the same");
    _;
  }
  
  modifier canQueryProvable() {
      require(provable_getPrice("URL") < address(this).balance);
      _;
  }
  
 function transferAmount(uint256 amount) public onlyOwner returns(bool) {
    msg.sender.transfer(amount);
 }

 function checkIn(uint transactionId) public returns (bool) {    
    if(transactions[transactionId].personA.walletAddress == msg.sender) {
      transactions[transactionId].personA.verified = true;
      return true;
    }
    if(transactions[transactionId].personB.walletAddress == msg.sender) {
      transactions[transactionId].personB.verified = true;
      return true;
    }

    if(transactions[transactionId].verifier.walletAddress == msg.sender) {
      transactions[transactionId].verifier.verified = true;
      return true;
    }

    return false;
  }


  function payIn(uint transactionId) public payable returns (bool)  {
    if (msg.value >= transactions[transactionId].amount && !transactions[transactionId].payedIn) {
      transactions[transactionId].payedIn = true;
      return true;
    }

    return false;
  }

  function payOut(uint transactionId) public isReady(transactionId) canPayout(transactionId) returns (bool) {
    Transaction memory transaction = transactions[transactionId];

    transactions[transactionId].personB.walletAddress.transfer(transaction.amount);
    transactions[transactionId].payedOut = true;
    
    emit PayedOut(transactions[transactionId].personA.walletAddress, 
                  transactions[transactionId].personB.walletAddress, 
                  transactionId);

    return transactions[transactionId].payedOut;
  }

  function getStatus(uint transactionId) public view returns (bool){
    return transactions[transactionId].payedOut;
  }

  function getUSDvalue() public payable canQueryProvable() {
      emit LogQueryProvable("Provable query was sent, standing by for the answer...");
      provable_query(60, "URL", "json(https://api.kraken.com/0/public/Ticker?pair=ETHUSD).result.XETHZUSD.c.0");
  }

  function destroyContract() public onlyOwner {
    selfdestruct(msg.sender);
  }   
}
