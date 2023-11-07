# ChainStay- A Decentralized Hotel Booking Platform

Important Steps in making the decentralized application:

1. npx create-react-app trialapp
will create app in user/dell/trialapp


2. Open that folder of trialapp in vs code and in their terminal type:
truffle init

3. Create and write the smart contract: BookingRoom.sol

4. Add the migrations in the migrations folder
const BookingRoom=artifacts.require('../contracts/BookingRoom.sol');

module.exports=function(deployer){
    deployer.deploy(BookingRoom);
}

5. Modify the truffle-config.js file
Add the following code under "network" 
       ganache: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
     network_id: "5777",       // Any network (default: none)
     },

6. truffle console --network ganache
(the prompt changes to "truffle>ganache")

7. truffle migrate
(check ganache, new block has been added now)


***************** REACT IMPLEMENTATION *********************


8. Create a folder inside the src folder named as "contracts"
Copy the file Counter.json (available in the build folder) to src

9. Write the react code in the App.js file

On the powershell terminal:
10. on the terminal type: npm install web3
11. type the command:  npm install ethereum/web3.js
12. To run the website on the browser
type: npm run start
(it will open localhost:3000 in the browser)

