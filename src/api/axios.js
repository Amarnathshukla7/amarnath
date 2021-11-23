import axios from "axios";

export const searchClient = axios.create({
  baseURL: "https://search-svc-labmweueeq-nw.a.run.app",
});

export const feedbackClient = axios.create({
  baseURL: "https://feedback.svc.bedsandbars.com",
});

export const resrvationClient = axios.create({
  baseURL: "https://reservation.bnb-platform.com/api",
});
