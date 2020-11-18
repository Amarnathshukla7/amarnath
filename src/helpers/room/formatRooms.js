import { differenceInDays } from "date-fns";
import { formatTimezone } from "../../../plugins/timezone";

const normalBooking = (rooms, roomContent) => {
  return {
    name: roomContent.fields.name,
    code: rooms[0].code,
    checkIn: rooms[0].date,
    checkOut: rooms[rooms.length - 1].date,
    qty: rooms[0].qty,
    maxOccupancy: rooms[0].max_occupancy,
    type: roomContent.fields.type,
    cost: rooms
      .map((room) => room.price_per_item * room.qty)
      .reduce((acc, val) => acc + val),
  };
};

const customBooking = (rooms, roomContent) => {
  return rooms.map((room) => ({
    name: roomContent.fields.name,
    code: room.code,
    checkIn: room.date,
    qty: room.qty,
    maxOccupancy: room.max_occupancy,
    type: roomContent.fields.type,
    cost: room.price_per_item * room.qty,
  }));
};

export function formatRooms(cart, roomsContent) {
  const normalBook = [];
  const customBook = [];

  const items = cart.items;
  const roomCodes = new Set(
    items
      .sort(
        (a, b) =>
          formatTimezone(new Date(a.date)) - formatTimezone(new Date(b.date)),
      )
      .map((room) => room.code),
  );

  roomCodes.forEach((roomCode) => {
    const rooms = items.filter((item) => item.code === roomCode);
    let normal = true;

    const roomContent = roomsContent.find(
      (room) => room.fields.roomCode == roomCode,
    );

    rooms.forEach((room, idx) => {
      if (idx > 0) {
        const diff = differenceInDays(
          formatTimezone(new Date(room.date)),
          formatTimezone(new Date(rooms[idx - 1].date)),
        );

        const qtyDiff = room.qty === rooms[idx - 1].qty;

        if (diff !== 1 || !qtyDiff) normal = false;
      }
    });

    normal && rooms.length !== 1
      ? normalBook.push(normalBooking(rooms, roomContent))
      : customBook.push(...customBooking(rooms, roomContent));

    const data = { normalBook, customBook };

    return data;
  });
}
