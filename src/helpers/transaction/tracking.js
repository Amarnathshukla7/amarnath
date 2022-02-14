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
  FPD: 204119,
  FPU: 204124,
};

const isWihpBooking = (hostelCode) => hostelCode in wihpIds;

const sendToDataLayer = (vm, reservation, name = "reservationCompleted") => {
  const keysToNullify = ["auth_user_id", "vendor_id", "secret_output"];
  keysToNullify.forEach((key) => {
    if (reservation.transaction.hasOwnProperty(key)) {
      reservation.transaction[key] = null;
    }
  });

  if (!vm.$gtm && !vm.$gtm.push) return;

  vm.$gtm.push({
    event: "bookingComplete",
    ...reservation,
  });

  if (isWihpBooking(reservation.cart.hostel_code)) {
    vm.$gtm.push({
      event: "wihpBookingComplete",
      idwihp: wihpIds[reservation.cart.hostel_code],
      ...reservation,
    });
  }
};

const thirdPartyTracking = (reservation) => {
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

export const track = (vm, reservation) => {
  sendToDataLayer(vm, reservation);
  thirdPartyTracking(reservation);
};
