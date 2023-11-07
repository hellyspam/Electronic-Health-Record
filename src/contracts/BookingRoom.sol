// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

contract BookingRoom {
    struct Reservation {
        address guest;
        uint checkInDate;
        uint checkOutDate;
        uint roomNumber;
        uint totalPrice;
        bool paid;
    }

    Reservation[] public reservations;

    uint public constant PRICE_PER_NIGHT = 1 ether;

    event ReservationCreated(address guest, uint checkInDate, uint checkOutDate, uint roomNumber, uint totalPrice);
    event ReservationPaid(uint reservationId);

    function createReservation(uint checkInDate, uint checkOutDate, uint roomNumber) public payable {
        require(msg.value == (checkOutDate - checkInDate) * PRICE_PER_NIGHT, "Invalid payment amount.");
        require(roomNumber >= 1 && roomNumber <= 10, "Invalid room number.");
        require(checkInDate >= block.timestamp, "Check-in date must be in the future.");
        require(checkOutDate > checkInDate, "Check-out date must be after check-in date.");

        Reservation memory reservation = Reservation(msg.sender, checkInDate, checkOutDate, roomNumber, msg.value, false);
        reservations.push(reservation);
        emit ReservationCreated(msg.sender, checkInDate, checkOutDate, roomNumber, msg.value);
    }

    function payReservation(uint reservationId) public payable {
        Reservation storage reservation = reservations[reservationId];
        require(reservation.guest == msg.sender, "Only the guest who created the reservation can pay.");
        require(reservation.paid == false, "Reservation has already been paid.");

        reservation.paid = true;
        emit ReservationPaid(reservationId);
    }
}
