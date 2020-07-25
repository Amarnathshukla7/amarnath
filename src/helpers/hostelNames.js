export const hostelShortName = (hostelCode) => {
  const hostels = {
    WIN: "The Winston - Amsterdam",
    FPD: "The Flying Pig Downtown - Amsterdam",
    FPU: "The Flying Pig Uptown - Amsterdam",
    BHS: "The Bauhaus - Bruges",
    BER: "St Christopher's Alexanderplatz - Berlin",
    BRA: "St Christopher's Alexanderplatz - Berlin",
    BRM: "St Christopher's Mitte - Berlin",
    COP: "Copenhagen Downtown Hostel",
    PRA: "The Czech Inn - Prague",
    PAR: "St Christopher's Canal - Paris",
    GDN: "St Christopher's Gare Du Nord - Paris",
    BCN: "St Christopher's Barcelona",
    BTH: "St Christopher's Bath",
    EDI: "St Christopher's Original - Edinburgh",
    EDO: "St Christopher's Old Town - Edinburgh",
    NQY: "St Christopher's Newquay",
    GRE: "St Christopher's Greenwich - London",
    INN: "St Christopher's The Inn - London",
    VIL: "St Christopher's London Bridge - London",
    OAS: "St Christopher's Oasis London Bridge - London",
    LPS: "St Christopher's Liverpool Street - London",
    CMD: "St Christopher's Camden - London",
    SHP: "St Christopher's Shepherd's Bush - London",
    HMM: "St Christopher's Hammersmith - London",
  };

  const shortName = hostels[hostelCode];

  return shortName;
};
