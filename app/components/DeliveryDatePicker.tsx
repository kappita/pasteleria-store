"use client";

import { useDeliveryAvailability } from "../hooks/useDeliveryAvailability";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { useState } from "react";

interface Props {
  value?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
}

export default function DeliveryDatePicker({ value, onChange }: Props) {
  const { data, loading, getDailyRemaining } = useDeliveryAvailability();
  const [open, setOpen] = useState(false);

  if (loading) return <p>Cargando fecha de entrega…</p>;
  if (!data) return <p>No se pudo cargar disponibilidad</p>;

  const disabled = (date: Date) => {
    const ymd = format(date, "yyyy-MM-dd");

    // Día no permitido
    if (!data.allowed_weekdays.includes(date.getDay())) return true;

    // Antes de min_date
    if (ymd < data.min_date) return true;

    // Fecha bloqueada
    if (data.blocked.includes(ymd)) return true;

    // Sin cupo disponible
    if (data.date_map[ymd] !== undefined && data.date_map[ymd] <= 0)
      return true;

    return false;
  };

  const selectedDate = value
    ? new Date(value + "T00:00:00")
    : new Date(data.first_valid + "T00:00:00");

  const daily = selectedDate
    ? getDailyRemaining(format(selectedDate, "yyyy-MM-dd"))
    : null;

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-700">
        Cupo global disponible:{" "}
        <span className="font-semibold">{data.global_remaining}</span>
      </p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="monica"
            className="p-6 text-lg text-black font-medium justify-start"
          >
            {value ? value : "Selecciona una fecha de entrega"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 bg-white">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              if (!d) return;
              const ymd = format(d, "yyyy-MM-dd");
              onChange?.(ymd);
              setOpen(false);
            }}
            disabled={disabled}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
