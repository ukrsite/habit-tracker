interface CalendarProps {
  month: string;
  onMonthChange: (month: string) => void;
  checkinDates: Set<string>;
  isLoading?: boolean;
}

export const Calendar = ({
  month,
  onMonthChange,
  checkinDates,
  isLoading = false,
}: CalendarProps) => {
  const [year, monthStr] = month.split('-').map(Number);
  const date = new Date(year, monthStr - 1, 1);
  const firstDay = date.getDay();
  const daysInMonth = new Date(year, monthStr, 0).getDate();

  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    let prevYear = year;
    let prevMonth = monthStr - 1;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear--;
    }
    const monthStr_ = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
    onMonthChange(monthStr_);
  };

  const handleNextMonth = () => {
    let nextYear = year;
    let nextMonth = monthStr + 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }
    const monthStr_ = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    onMonthChange(monthStr_);
  };

  const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition"
        >
          →
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-gray-500">
          Loading check-ins...
        </div>
      ) : checkinDates.size === 0 ? (
        <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-600 font-medium">No check-ins yet</p>
            <p className="text-sm text-gray-500 mt-1">Start checking in today to build your streak!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="aspect-square bg-gray-50 rounded"
                />
              );
            }

            const dateStr = `${year}-${String(monthStr).padStart(2, '0')}-${String(
              day
            ).padStart(2, '0')}`;
            const isCheckedIn = checkinDates.has(dateStr);
            const today = new Date().toISOString().slice(0, 10);
            const isToday = dateStr === today;

            return (
              <div
                key={day}
                className={`aspect-square rounded flex items-center justify-center text-sm font-medium transition ${
                  isCheckedIn
                    ? 'bg-green-500 text-white'
                    : isToday
                      ? 'bg-blue-100 text-blue-900 border-2 border-blue-500'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isCheckedIn ? '✓' : day}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
