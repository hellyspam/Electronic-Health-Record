import React, { useState } from "react";
import Web3 from "web3";
import BookingRoomContract from "../src/contractsCopy/BookingRoom.json";
import bg from '../src/wallpaper.jpg';
import '../src/App.css';


function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [roomNumber, setRoomNumber] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BookingRoomContract.networks[networkId];
      const contract = new web3.eth.Contract(
        BookingRoomContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(contract);
      const reservationsCount = await contract.methods
        .reservationsCount()
        .call();
      const reservations = [];
      for (let i = 0; i < reservationsCount; i++) {
        const reservation = await contract.methods.reservations(i).call();
        reservations.push(reservation);
      }
      setReservations(reservations);
    } else {
      alert("Please install MetaMask to use this dApp.");
    }
  };

  const createReservation = async () => {
    const checkInDateUnix = new Date(checkInDate).getTime() / 1000;
    const checkOutDateUnix = new Date(checkOutDate).getTime() / 1000;
    const totalPriceWei = web3.utils.toWei(totalPrice.toString(), "ether");
    await contract.methods
      .createReservation(checkInDateUnix, checkOutDateUnix, roomNumber)
      .send({ from: accounts[0], value: totalPriceWei });
    setReservations([
      ...reservations,
      {
        guest: accounts[0],
        checkInDate: checkInDateUnix,
        checkOutDate: checkOutDateUnix,
        roomNumber,
        totalPrice: totalPriceWei,
        paid: true,
      },
    ]);
  };

  const payReservation = async (reservationId) => {
    const reservation = reservations[reservationId];
    await contract.methods
      .payReservation(reservationId)
      .send({ from: accounts[0] });
    reservation.paid = true;
    setReservations([
      ...reservations.slice(0, reservationId),
      reservation,
      ...reservations.slice(reservationId + 1),
    ]);
  };

  if (!web3) {
    return (
      <div>
        <button onClick={loadWeb3}>Connect to MetaMask</button>
      </div>
    );
  }

  return (
    <div class="background">
       <br/>
    <div class="back">
      
      <h1 class="heading"><i>Electronic Health Recording</i></h1>
        <h2 class="labh">Save the health Record</h2>

        <label class="lab">Admit Date:</label>
        <input class="inputs"
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
        <br />
        <label class="lab">Release Date:</label>
        <input class="inputs"
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
        <br />
        <label class="lab">Ward number:</label>
        <input class="inputs"
          type="number"
          min="1"
          max="10"
          value={roomNumber}
          onChange={(e) => setRoomNumber(parseInt(e.target.value))}
        />
        <br />
        <label class="lab">Treatment amount: </label>
        <input class="inputs"
          type="number"
          step="0.01"
          value={totalPrice}
          onChange={(e) => setTotalPrice(parseFloat(e.target.value))}
        />
        <br />
        <button class="reserve-button" onClick={createReservation}>Create Record</button>
        <br/>
        <br/>
      </div>
      <div>
        <h2 class="res_head"><u>Records</u></h2>
        <table border="1" class="edit back">
          <thead>
            <tr class="tr">
              <th class="th">Patient</th>
              <th class="th">Admit Date</th>
              <th class="th">Release Date</th>
              <th class="th">Ward Number</th>
              <th class="th">Treatment amount</th>
              <th class="th">Paid</th>
              <th class="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.guest}</td>
                <td>
                  {new Date(
                    reservation.checkInDate * 1000
                  ).toLocaleDateString()}
                </td>
                <td>
                  {new Date(
                    reservation.checkOutDate * 1000
                  ).toLocaleDateString()}
                </td>
                <td>{reservation.roomNumber}</td>
                <td>
                  {web3.utils.fromWei(
                    reservation.totalPrice.toString(),
                    "ether"
                  )}
                </td>
                <td>{reservation.paid ? "Yes" : "No"}</td>
                <td>
                  {!reservation.paid && (
                    <button onClick={() => payReservation(index)}>Pay</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      </div>
    </div>
  );
}

export default App;


/*
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import HotelBooking from '../src/contracts copy/HotelBooking.json';

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [bookingContract, setBookingContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [pricePerNight, setPricePerNight] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const init = async () => {
      // Connect to Ethereum network with Metamask
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3);

        // Load smart contract
        const networkId = await web3.eth.net.getId();
        const contractAddress = HotelBooking.networks[networkId].address;
        const contract = new web3.eth.Contract(HotelBooking.abi, contractAddress);
        setBookingContract(contract);

        // Get account and price per night
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const _pricePerNight = await contract.methods.pricePerNight().call();
        setPricePerNight(web3.utils.fromWei(_pricePerNight));

        // Load bookings for current account
        const bookingsCount = await contract.methods.bookingsCount(account).call();
        const _bookings = [];
        for (let i = 0; i < bookingsCount; i++) {
          const booking = await contract.methods.bookings(account, i).call();
          _bookings.push(booking);
        }
        setBookings(_bookings);
      } else {
        console.error('Metamask not detected');
      }
    }
    init();
  }, []);

  const book = async (nights) => {
    const value = web3.utils.toWei((nights * pricePerNight).toString());
    await bookingContract.methods.book(nights).send({ from: account, value });
    const bookingsCount = await bookingContract.methods.bookingsCount(account).call();
    const _bookings = [];
    for (let i = 0; i < bookingsCount; i++) {
      const booking = await bookingContract.methods.bookings(account, i).call();
      _bookings.push(booking);
    }
    setBookings(_bookings);
  }

  return (
    <div className="App">
    <h1>Hotel Booking</h1>
    {account ?
    <div>
    <p>Account: {account}</p>
    <p>Price per night: {pricePerNight} ETH</p>
    <button onClick={() => book(1)}>Book 1 night</button>
    <button onClick={() => book(2)}>Book 2 nights</button>
    <h2>Your bookings:</h2>
    <ul>
    {bookings.map((booking, index) => (
    <li key={index}>You booked {booking.nights} nights for {web3.utils.fromWei(booking.totalPrice)} ETH</li>
    ))}
    </ul>
    </div>
    :
    <p>Connecting to Metamask...</p>
    }
    </div>
    );
    }
    
    export default App;
   */