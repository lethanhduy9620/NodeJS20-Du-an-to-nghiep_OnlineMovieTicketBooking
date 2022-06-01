"use strict";

const { Tickets, TicketDetails, Showtimes } = require("../../models");
const { toPlain } = require("../util");

const createTicket = async (data) => {
  try {
    const ticket = await Tickets.create(data);

    return ticket;
  } catch (error) {
    return null;
  }
};

const createTicketDetail = async (ticketId, seatList) => {
  try {
    let ticketDetailData = [];
    seatList.forEach((seat) => {
      const seatObj = { ticketId, seatId: seat.seatId };
      ticketDetailData.push(seatObj);
    });

    const ticketDetail = await TicketDetails.bulkCreate(ticketDetailData);

    return ticketDetail;
  } catch (error) {
    return null;
  }
};

const checkResveredSeat = async (showtimeId, seatList) => {
  try {
    const ticketInfoIns = await Tickets.findAll({
      where: {
        showtimeId,
      },
      attributes: ["showtimeId", ["id", "ticketId"]],
      include: {
        model: TicketDetails,
        as: "seatList",
        attributes: ["seatId"],
      },
    });

    const ticketInfo = toPlain(ticketInfoIns);
    let reservedSeatArray = [];
    ticketInfo.forEach((ticket) => {
      ticket.seatList.forEach((seat) => {
        reservedSeatArray.push(seat.seatId);
      });
    });

    for (let seat of seatList) {
      if (reservedSeatArray.indexOf(Number(seat.seatId)) >= 0) {
        return true;
      }
    }
    return false;
  } catch (error) {
    return null;
  }
};

const checkShowtimeExist = async (showtimeId) => {
  try {
    const showtime = await Showtimes.findOne({
      where: {
        id: showtimeId,
      },
      attributes: ["id"],
    });
    return showtime;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createTicket,
  createTicketDetail,
  checkResveredSeat,
  checkShowtimeExist,
};
