'use client';

interface DeliverySlot {
  date: string;            // e.g., "2026-01-14"
  display: string;         // e.g., "January 14, 2026"
  timestamp: string;       // Your API returned this as a string "1768359600"
  slots_available: number; // e.g., 5
  is_available: boolean;   // e.g., true
}

interface DeliveryDateSelectorProps {
  availableDates: DeliverySlot[],
  cartQuantity: number;
  selectedDate: string | null;
  onDateSelect: (date: string, timestamp: string, slots: number) => void;
}


const DeliveryDateSelector: React.FC<DeliveryDateSelectorProps> = ({
  availableDates,
  cartQuantity, 
  selectedDate, 
  onDateSelect 
}) => {



  return (
    <div className="w-full max-w-3xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Selecciona una fecha para la entrega
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {availableDates.map((slot: DeliverySlot) => {
          // LOGIC: Date is valid if available AND has enough slots for cart quantity
          const hasCapacity = slot.slots_available >= cartQuantity;
          const isSelectable = slot.is_available && hasCapacity;
          const isSelected = selectedDate === slot.date;
          const isDisabled = !slot.is_available && slot.slots_available > 0

          return (
            <button
              key={slot.date}
              type="button"
              onClick={() => isSelectable && onDateSelect(slot.date, slot.timestamp, slot.slots_available)}
              disabled={!isSelectable}
              className={`
                relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all duration-200
                ${isSelected 
                  ? 'border-[#E985A7] bg-blue-50 ring-1 ring-[#CF849D] z-10' 
                  : 'border-gray-200 bg-white hover:border-[#CF849D]'}
                ${!isSelectable 
                  ? 'opacity-60 cursor-not-allowed bg-gray-50' 
                  : 'cursor-pointer shadow-sm hover:shadow-md'}
              `}
              aria-label={`Select ${slot.display}`}
              aria-pressed={isSelected}
            >
              {/* Date Header */}
              <span className={`font-bold text-sm mb-1 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                {slot.display}
              </span>

              {/* Capacity Status */}
              <div className="text-xs mt-auto">
                {isDisabled ? (
                  <span className="text-red-500 font-semibold">Sin entregas este día</span>
                ) :
                
                !slot.is_available ? (
                   <span className="text-red-500 font-semibold">Agotado</span>
                ) : !hasCapacity ? (
                   <span className="text-orange-600 font-medium flex items-center gap-1">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                     </svg>
                     Capacidad insuficiente. ({slot.slots_available} productos restantes)
                   </span>
                ) : (
                   <span className={`${isSelected ? 'text-black' : 'text-green-600'} font-medium`}>
                     Disponible ({slot.slots_available} productos)
                   </span>
                )}
              </div>

              {/* Checkmark Icon */}
              {isSelected && (
                <div className="absolute top-3 right-3 text-[#E985A7]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryDateSelector;