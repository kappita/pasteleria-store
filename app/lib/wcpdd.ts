import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wcpdd/v1`;

const wcpdd = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- ENDPOINTS ----

// Config general (bloqueados, minDate, etc.)
export const getWcpddConfig = () => wcpdd.get("/config");

// Cupo global
export const getWcpddGlobal = () => wcpdd.get("/global");

// Cupos por fecha
export const getWcpddAvailability = (start: string, days = 365) =>
  wcpdd.get("/availability", {
    params: { start, days },
  });

// Información de fechas permitidas
export const getWcpddDates = () => wcpdd.get("/dates");

//Holds (reservas)
export const createHold = (date: string, qty: number) =>
  wcpdd.post("/hold", { date, qty });

export const clearHold = () => wcpdd.post("/hold/clear");

export default wcpdd;
