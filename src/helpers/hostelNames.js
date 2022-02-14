export const hostelShortName = (hostelCode) => {
  const hostels = {
    WIN: "Amsterdam - The Winston",
    FPD: "Amsterdam - Flying Pig Downtown",
    FPU: "Amsterdam - Flying Pig Uptown",
    BHS: "Bruges - The Bauhaus",
    BER: "Berlin Alexanderplatz Hostel",
    BRA: "Berlin Alexanderplatz Apartments",
    BRM: "Berlin Mitte Hostel",
    COP: "Copenhagen - Downtown Hostel",
    BWD: "Copenhagen - Bedwood hostel",
    PRA: "Prague - The Czech Inn",
    PAR: "Paris Canal Hostel",
    GDN: "Paris Gare Du Nord Hostel",
    BCN: "Barcelona Hostel",
    BTH: "Bath Hostel",
    EDI: "Edinburgh - The Original Hostel",
    EDO: "Edinburgh - The Old Town Hostel",
    NQY: "Newquay Hostel",
    GRE: "London - Greenwich Hostel",
    INN: "London Bridge - The Inn",
    VIL: "London Bridge - The Village",
    OAS: "London Bridge - The Oasis",
    LPS: "London - Liverpool Street Hostel",
    CMD: "London - Camden Hostel",
    SHP: "London - Shepherd's Bush Hostel",
    HMM: "London - Hammersmith Hostel",
    VIE: "Vienna - Vienna Hostel",
  };

  const shortName = hostels[hostelCode];

  return shortName;
};
