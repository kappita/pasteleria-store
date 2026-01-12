"use client";

import { useEffect, useState } from "react";
import {
  getWcpddAvailability,
  getWcpddDates,
  getWcpddConfig,
} from "../lib/wcpdd";

export interface DateAvailabilityMap {
  [ymd: string]: number; // remaining units for that day
}

export interface DeliveryData {
  date_map: DateAvailabilityMap;
  global_remaining: number;
  global_capacity: number;
  first_valid: string;
  min_date: string;
  blocked: string[];
  allowed_weekdays: number[];
}

export function useDeliveryAvailability() {
  const [data, setData] = useState<DeliveryData | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [availabilityRes, datesRes, configRes] = await Promise.all([
        getWcpddAvailability(new Date().toISOString().slice(0, 10), 365),
        getWcpddDates(),
        getWcpddConfig(),
      ]);

      setData({
        date_map: availabilityRes.data.date_map,
        global_remaining: availabilityRes.data.global_remaining,
        first_valid: datesRes.data.first_valid,
        min_date: datesRes.data.min_date,
        blocked: datesRes.data.blocked,
        allowed_weekdays: datesRes.data.allowed_weekdays,
        global_capacity: configRes.data.globalCapacity,
      });
    } catch (e) {
      console.error("Error loading delivery data:", e);
    } finally {
      setLoading(false);
    }
  }

  // Cargar al montar
  useEffect(() => {
    load();

    const interval = setInterval(load, 15000); // cada 15s
    return () => clearInterval(interval);
  }, []);

  //Añadir una función pública para forzar recarga (opcional)
  const refresh = () => load();

  const getDailyRemaining = (ymd: string) => {
    if (!data) return null;
    if (!data.date_map[ymd]) return null;
    return data.date_map[ymd];
  };

  return { data, loading, getDailyRemaining, refresh };
}
