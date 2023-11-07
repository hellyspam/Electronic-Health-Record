const BookingRoom = artifacts.require("../contracts/BookingRoom.sol");
//const BookingCancel = artifacts.require("../contracts/BookingCancel.sol");
//const Hotel = artifacts.require("./Hotel.sol");

module.exports = function(deployer) {
 // await deployer.deploy(Hotel);
 //deployer.deploy(BookingCancel);
 deployer.deploy(BookingRoom);

//transfer it all to hotel
//transfer the reward so here we will transfer the room booking
};



