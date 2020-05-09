import Vue from "vue";
import VueLoadScript from "vue-load-script-plus";
import axios from "axios";

Vue.use(VueLoadScript);

const getRoom = (rooms, code) =>
  rooms.find((room) => room.fields.roomCode === code);

export const wihpTracking = (reservation) => {
  if (reservation.cart.hostel_code in wihpIds) {
    const params = {
      act: "conversion",
      ref: reservation.booking_reference,
      amount: reservation.cart.accommodation_cost / 100,
      currency: reservation.cart.hostel.currency,
      idwihp: wihpIds[reservation.cart.hostel_code],
      checkin: reservation.cart.check_in,
      checkout: reservation.cart.check_out,
    };

    const urlParams = new URLSearchParams(params).toString();

    this.$loadScript(
      "https://secure-hotel-tracker.com/tics/log.php?" + urlParams,
    );

    if (window.gtag) {
      window.gtag("event", "purchase", {
        send_to: ["AW-668251050/skpSCOOzzMIBEKrn0r4C", "HA-75"],
        transaction_id: reservation.booking_reference,
        value: reservation.cart.accommodation_cost / 100,
        currency: reservation.cart.hostel.currency,
        items: [],
      });
    }

    if (window.dataLayer) {
      window.dataLayer.push({
        event: "bookingMade",
        hotelId: wihpIds[reservation.cart.hostel_code], // This will return the WIHP ID for the hotel
        transactionId: reservation.booking_reference, // This is the booking web reference (e.g. STC-WIN-987654321)
        bookingValue: reservation.cart.accommodation_cost / 100,
        bookingCurrency: reservation.cart.hostel.currency, // This is currently not accurate because we have added currency selection to the booking, will update shortly
        arrivalDate: reservation.cart.check_in,
        departureDate: reservation.cart.check_out,
      });
    }
  }
};

export const ownTracking = (reservation) => {
  if (window.ga) {
    window.ga("send", {
      hitType: "event",
      eventCategory: "Booking",
      eventAction: "booking_confirmed",
      eventLabel: hostel.code,
      eventValue: reservation.total / 100,
    });

    window.ga("ecommerce:addTransaction", {
      id: reservation.bookingReference,
      affiliation: hostel.code,
      revenue: reservation.total / 100,
      shipping: 0,
      tax: 0,
    });

    window.ga("ecommerce:send");
  }

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

  wihpTracking(reservation);
};

const wihpIds = {
  VIL: 190101,
  EDO: 190102,
  EDI: 190103,
  PAR: 190104,
  GDN: 190105,
  BRM: 190106,
  BER: 190107,
  WIN: 190108,
  BCN: 190109,
  GRE: 190110,
  HMM: 190111,
};
