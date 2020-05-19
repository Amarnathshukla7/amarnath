import Vue from "vue";
import VueLoadScript from "vue-load-script-plus";

Vue.use(VueLoadScript);

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

const isWihpBooking = (hostelCode) => hostelCode in wihpIds;

const sendToDataLayer = (reservation, name = "reservationCompleted") => {
  const keysToNullify = ["auth_id", "vendor_id", "secret_output"];
  keysToNullify.forEach((key) => {
    if (reservation.transaction[key]) reservation.transaction[key] = null;
  });

  if (!this.$gtm) return;

  this.$gtm.push({
    event: "bookingComplete",
    ...reservation,
  });

  if (isWihpBooking(reservation.cart.hostel_code)) {
    this.$gtm.push({
      event: "wihpBookingComplete",
      idwihp: wihpIds[reservation.cart.hostel_code],
      ...reservation,
    });
  }
};

const thirdPartyTracking = () => {
  // if (window.ga) {
  //   window.ga("send", {
  //     hitType: "event",
  //     eventCategory: "Booking",
  //     eventAction: "booking_confirmed",
  //     eventLabel: hostel.code,
  //     eventValue: reservation.total / 100,
  //   });

  //   window.ga("ecommerce:addTransaction", {
  //     id: reservation.bookingReference,
  //     affiliation: hostel.code,
  //     revenue: reservation.total / 100,
  //     shipping: 0,
  //     tax: 0,
  //   });

  //   window.ga("ecommerce:send");
  // }

  if (window.uetq) {
    window.uetq.push("event", "click", {
      event_category: "bookings",
      event_label: "book now",
      event_value: reservation.cart.total_cost / 100,
    });
  }

  if (window.fbq) {
    window.fbq("track", "Purchase", {
      value: reservation.paid / 100,
      currency: reservation.transaction.currency,
    });
  }

  if (window.criteo_q) {
    window.criteo_q = window.criteo_q || [];
    window.criteo_q.push(
      { event: "setAccount", account: 19587 },
      { event: "setSiteType", type: "d" },
      {
        event: "viewSearch",
        checkin_date: reservation.cart.check_in,
        checkout_date: reservation.cart.check_out,
      },
      {
        event: "trackTransaction",
        id: reservation.booking_reference,
        item: reservation.cart,
      },
    );
  }
};

export const track = (reservation) => {
  sendToDataLayer(reservation);
};
