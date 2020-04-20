export const filter = (room, filters) => {
  const filterList = {
    private: room.type === "private",
    shared: room.type === "dorm",
    female: room.female,
    ensuite: room.ensuite,
    couples: room.type === "private",
  };

  return !Object.keys(filterList)
    .filter((filter) => filters.includes(filter))
    .every((filt) => filterList[filt]);
};
