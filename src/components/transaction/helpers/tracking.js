import axios from "axios";

const getRoom = (rooms, code) =>
  rooms.find(room => room.fields.roomCode === code);

export const wihpTracking = reservation => {
  axios.get("https://secure-hotel-tracker.com/tics/log.php", {
    params: {
      act: "conversion",
      ref: reservation.booking_reference,
      amount: reservation.cart.accommodation_cost / 100,
      currency: reservation.cart.hostel.currency,
      idwihp: "",
      checkin: reservation.cart.check_in,
      checkout: reservation.cart.check_out,
    },
  });

  window.gtag("event", "purchase", {
    send_to: ["AW-668251050/skpSCOOzzMIBEKrn0r4C", "HA-75"],
    transaction_id: reservation.booking_reference,
    value: reservation.cart.accommodation_cost / 100,
    currency: reservation.cart.hostel.currency,
    items: [],
  });
};

export const ownTracking = (vm, reservation, rooms) => {
  vm.$ga.event({
    eventCategory: "Booking",
    eventAction: "booking_confirmed",
    eventLabel: hostel.code,
    eventValue: reservation.total / 100,
  });

  vm.$ga.ecommerce.addTransaction({
    id: reservation.bookingReference,
    affiliation: hostel.code,
    revenue: reservation.total / 100,
    shipping: 0,
    tax: 0,
  });

  if (window.uetq) {
    window.uetq.push("event", "click", {
      event_category: "bookings",
      event_label: "book now",
      event_value: reservation.total / 100,
    });
  }

  if (window.fbq) {
    window.fbq("track", "Purchase", {
      value: reservation.total / 100,
      currency: hostel.currency,
    });
  }

  vm.$ga.ecommerce.send();

  if (window.criteo_q) {
    window.criteo_q = window.criteo_q || [];
    window.criteo_q.push(
      { event: "setAccount", account: 19587 },
      { event: "setSiteType", type: "d" },
      {
        event: "viewSearch",
        checkin_date: cart.checkIn,
        checkout_date: cart.checkOut,
      },
      {
        event: "trackTransaction",
        id: reservation.bookingReference,
        item: items,
      },
    );
  }
};