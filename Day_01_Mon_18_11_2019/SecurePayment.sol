pragma solidity ^0.5.11;

contract SecurePayment {
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

  uint precentage = 10;
  Transaction[] transactions;
  
  function create(address payable _personA, address payable _personB, address payable _middleMan, uint256 _amount, string memory _description) public returns (uint) {
    Transaction memory transaction = Transaction( 
                                        Person(_personA, false), 
                                        Person(_personB, false), 
                                        Person(_middleMan, false), 
                                        _amount,
                                        false,
                                        false,
                                        _description);

    uint transactionId = transactions.push(transaction) - 1;

    return transactionId;
  }

  function checkIn(uint transactionId) public returns (bool) {
    Transaction memory transaction = transactions[transactionId];

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

  function payOut(uint transactionId) public returns (bool) {
    Transaction memory transaction = transactions[transactionId];

    if (transaction.personA.verified && 
        transaction.personB.verified &&
        transaction.verifier.verified &&
        transaction.payedIn &&
        transaction.verifier.walletAddress == msg.sender) 
    {

      transactions[transactionId].personB.walletAddress.transfer(transaction.amount);
      transactions[transactionId].payedOut = true;
      
      return transactions[transactionId].payedOut;
    }

    return false;
  }

  function getStatus(uint transactionId) public view returns (bool){
    return transactions[transactionId].payedOut;
  }
}
