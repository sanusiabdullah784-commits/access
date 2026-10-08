import { useState } from 'react';

function Calendar({ selectedDate, onDateSelect, bookedDays = [] }) {
  const today = new Date();
  
  // State for navigating months (starts at current month)
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  
  // State for triggering smooth transition animation
  const [isAnimating, setIsAnimating] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = [];
  
  // Empty slots for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`}></div>);
  }
  
  // Generate days for the current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dateToCheck = new Date(year, month, i);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const isPast = dateToCheck < todayStart;
    const isFullyBooked = bookedDays.includes(i);
    const isDisabled = isPast || isFullyBooked;
    
    const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const isSelected = i === selectedDate;
    
    days.push(
      <div 
        key={i} 
        onClick={() => !isDisabled && onDateSelect(i)}
        className={`p-3 text-center rounded-lg transition-all duration-200 font-medium relative flex flex-col items-center justify-center ${
          isDisabled 
            ? 'bg-gray-50 text-gray-300 cursor-not-allowed line-through' 
            : isSelected 
              ? 'bg-brand-navy text-white shadow-lg transform scale-105 cursor-pointer' 
              : isToday 
                ? 'bg-brand-cyan/20 text-brand-navy font-bold cursor-pointer hover:bg-brand-cyan/30' 
                : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
        }`}
      >
        <span>{i}</span>
        
        {/* Fully Booked Indicator Dot */}
        {isFullyBooked && !isSelected && (
          <span className="absolute bottom-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        )}
      </div>
    );
  }

  // Handle Month Navigation with Animation
  const handleMonthChange = (direction) => {
    setIsAnimating(true);
    setTimeout(() => {
      setViewDate(new Date(year, month + direction, 1));
      // Reset selected date if navigating to a new month to avoid confusion
      if (direction !== 0) onDateSelect(null); 
      setTimeout(() => setIsAnimating(false), 50);
    }, 150); // Wait for fade out
  };

  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 select-none">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => handleMonthChange(-1)}
          disabled={isCurrentMonth}
          className={`p-2 rounded-full transition ${
            isCurrentMonth 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-brand-navy hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <h2 className="text-xl font-bold text-brand-navy">
          {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        
        <button 
          onClick={() => handleMonthChange(1)}
          className="p-2 rounded-full text-brand-navy hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">{day}</div>
        ))}
      </div>
      
      {/* Calendar Grid with Smooth Transition */}
      <div 
        key={month} // Changing key triggers re-render for animation
        className={`grid grid-cols-7 gap-2 transition-all duration-300 ${
          isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
        }`}
      >
        {days}
      </div>

      {/* Legend for Fully Booked Dates */}
      {bookedDays.length > 0 && (
        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          <span>Fully Booked</span>
        </div>
      )}
    </div>
  );
}

export default Calendar;