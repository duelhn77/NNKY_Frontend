import React from 'react';
import PropTypes from 'prop-types';
export const TimeSlots = ({ slots, selectedTime, onTimeSelect }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">予約可能な時間</h3>
      <div className="grid grid-cols-2 gap-4">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.time;
          return (
            <button
              key={slot.time}
              onClick={() => {
                if (slot.available) {
                  onTimeSelect(slot.time);
                }
              }}
              disabled={!slot.available}
              className={`p-4 text-center rounded-lg border transition ${
                isSelected
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : slot.available
                  ? 'border-gray-300 hover:border-gray-400'
                  : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
};
TimeSlots.propTypes = {
  slots: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      time: PropTypes.string.isRequired,
      available: PropTypes.bool.isRequired,
    })
  ).isRequired,
  selectedTime: PropTypes.number,
  onTimeSelect: PropTypes.func.isRequired,
};