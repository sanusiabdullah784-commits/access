import { useState } from 'react';

function Calendar({ selectedDate, onDateSelect }) {
  const [currentDate] = useState(new Date());
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`}></div>);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === currentDate.getDate();
    const isSelected = i === selectedDate;
    
    days.push(
      <div 
        key={i} 
        onClick={() => onDateSelect(i)}
        className={`p-3 text-center rounded-lg cursor-pointer transition font-medium ${
          isSelected 
            ? 'bg-brand-navy text-white shadow-lg transform scale-105' 
            : isToday 
              ? 'bg-brand-cyan/20 text-brand-navy font-bold' 
              : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-brand-navy mb-6 text-center">
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-bold text-gray-500 uppercase">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
}

export default Calendar;