var SecurePayment = artifacts.require("./SecurePayment.sol");

module.exports = function(deployer) {
  deployer.deploy(SecurePayment);
};
