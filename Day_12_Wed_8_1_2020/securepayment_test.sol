pragma solidity >=0.4.0 <0.6.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "./secure_payment.sol";

/// @title Secure payment test
/// @author Daniyal Hussain
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
contract securepayment_test {
  SecurePayment securepaymentContract;
  uint transactionId;
  uint transactionId2;
  address payable currentAddress = address(this);

  function beforeAll() public {
    // here should instantiate tested contract
    securepaymentContract = new SecurePayment();
  }
  
  function createPaymentShouldCompile() public {
    // use 'Assert' to test the contract
      transactionId = securepaymentContract.create(
        currentAddress,
        0xAA9f523547618eca5ae6ee208D1aF03A19Cbf518,
        0x49EDb1adB45B49ceB3284ab28a340efFefe01e88,
        20,
        "Test"
        );
        
      Assert.equal(transactionId, 1, "Transaction id needs to be 1");
  }
  
  function createPayment2ShouldCompile() public {
    // use 'Assert' to test the contract
      transactionId2 = securepaymentContract.create(
        0x49EDb1adB45B49ceB3284ab28a340efFefe01e88,
        0xAA9f523547618eca5ae6ee208D1aF03A19Cbf518,
        0x49EDb1adB45B49ceB3284ab28a340efFefe01e88,
        20,
        "Test"
        );
        
      Assert.equal(transactionId2, 2, "Transaction id needs to be 1");
  }
  
  function checkPayout() public {
      bool status = securepaymentContract.getStatus(transactionId);
      
      Assert.equal(status, false, "Payout should be false");
  }
  
  function checkIn() public {
      bool checked = securepaymentContract.checkIn(transactionId);
      
      Assert.equal(checked, true, "should be true");
  }

    function checkInFalse() public {
      bool checked = securepaymentContract.checkIn(transactionId2);
      
      Assert.equal(checked, false, "should be true");
  }

  function () external payable {
      // Done for testing purposes
  }
}