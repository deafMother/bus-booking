import axios from "axios";
export const API_GEOCODE = "e5450aca10224e3e8243c35c79ab2efa";

const instance = axios.create({
  baseURL: "http://localhost:3000"
});

export const instanceGeocode = axios.create({
  baseURL: "https://api.opencagedata.com/geocode/v1"
});

export default instance;
