import contentful from "./contentful";

export const getHostel = async code => {
  const hostelReq = await contentful.getEntries({
    include: 1,
    content_type: "hostel",
    "fields.code": code,
    select:
      "fields.currency,fields.rooms,fields.code,fields.shortName,fields.streetAddress,fields.gallery,fields.hostelPage,fields.description,fields.facilities,fields.attractions,fields.title,fields.mainImage,fields.basicContentBlocks,fields.whatToKnow",
  });

  return hostelReq.items[0].fields;
};
