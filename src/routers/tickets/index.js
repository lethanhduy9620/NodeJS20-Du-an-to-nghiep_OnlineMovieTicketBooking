"use strict";

const express = require("express");
const { authenticate, checkRole } = require("../../middleware/auth");
const { responseData } = require("../../services/response");
const {
  createTicket,
  createTicketDetail,
  checkResveredSeat,
  checkShowtimeExist,
} = require("../../services/tickets");

const ticketRouter = express.Router();

ticketRouter.post(
  "/create-ticket",
  [authenticate, checkRole("USER")],
  async (req, res) => {
    const userId = req.user.id;
    const { showtimeId, seatList } = req.body;

    const showtime = await checkShowtimeExist(showtimeId);
    if (!showtime) {
      return res.status(404).send(responseError("Showtime doesn't not exist"));
    }

    const hasReservedSeat = await checkResveredSeat(showtimeId, seatList);

    if (hasReservedSeat) {
      return res.status(409).send(responseError("Ticket has reserved seats"));
    } else if (hasReservedSeat === null) {
      return res.status(500).send(responseError("Server has errors"));
    }

    let payment = 0;
    seatList.forEach((seat) => {
      payment += Number(seat.price);
    });

    const ticket = await createTicket({
      userId,
      showtimeId,
      payment,
    });

    if (!ticket) {
      res.status(500).send(responseError("Server has errors"));
    }

    const ticketId = ticket.dataValues.id;

    const ticketDetail = await createTicketDetail(ticketId, seatList);

    if (!ticketDetail) {
      return res.status(500).send(responseError("Server has errors"));
    }

    return res.status(200).send(responseData("Create ticket successfully"));
  }
);

module.exports = ticketRouter;
