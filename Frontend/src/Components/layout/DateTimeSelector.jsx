import React, { useState } from 'react';
import {Calendar, Clock, Plus, Minus} from "lucide-react";
import "../../styles/DateTimeSelector.css";

const DateTimeSelector = ({
                              selectedDate,
                              selectedStartTime,
                              selectedEndTime,
                              // duration,
                              onDateChange,
                              onStartTimeChange,
                              onEndTimeChange,
                              //onDurationChange
                          }) => {
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    const durationOptions = [
        {value: 1, label: '1 hour'},
        {value: 1.5, label: '1.5 hours'},
        {value: 2, label: '2 hours'},
        {value: 3, label: '3 hours'},
        {value: 4, label: '4 hours'},
        {value: 6, label: '6 hours'},

    ];

    const [duration, setDuration] = useState(1);

    const today = new Date();
    const dates = Array.from({length: 14}, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
    });

    // Convert 12-hour format to minutes for calculation
    const timeToMinutes = (timeString) => {
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        return hours * 60 + minutes;
    };

    // Convert minutes back to 12-hour format
    const minutesToTime = (minutes) => {
        let hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';

        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
    };

    // Calculate end time based on start time and duration
    const calculateEndTime = (startTime, durationHours) => {
        if (!startTime) return null;

        const startMinutes = timeToMinutes(startTime);
        const endMinutes = startMinutes + (durationHours * 60);

        // Check if end time exceeds working hours (6 PM = 18:00 = 1080 minutes)
        if (endMinutes > 1080) {
            return null; // Invalid - would go past business hours
        }

        return minutesToTime(endMinutes);
    };

    // Filter available start times based on duration
    const getAvailableStartTimes = () => {
        return timeSlots.filter(time => {
            const endTime = calculateEndTime(time, duration);
            return endTime !== null;
        });
    };

    // Handle start time selection
    const handleStartTimeSelect = (startTime) => {
        onStartTimeChange(startTime);
        const calculatedEndTime = calculateEndTime(startTime, duration);
        onEndTimeChange(calculatedEndTime);
    };

    // Handle duration change
    const handleDurationChange = (newDuration) => {
        setDuration(newDuration);

        // Recalculate end time if start time is already selected
        if (selectedStartTime) {
            const newEndTime = calculateEndTime(selectedStartTime, newDuration);
            if (newEndTime) {
                onEndTimeChange(newEndTime);
            } else {
                // If new duration makes current start time invalid, clear selections
                onStartTimeChange(null);
                onEndTimeChange(null);
            }
        }
    };

    const availableStartTimes = getAvailableStartTimes();

    return (
        <div className="datetime-selector">
            <div className="date-selector">
                <h4 className="selector-title">
                    <Calendar size={18}/>
                    Select Date
                </h4>
                <div className="date-grid">
                    {dates.map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === dateStr;
                        const dayName = date.toLocaleDateString('en', {weekday: 'short'});
                        const dayNumber = date.getDate();
                        const isToday = index === 0;

                        return (
                            <button
                                key={index}
                                className={`date-option ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                onClick={() => onDateChange(dateStr)}
                            >
                                <span className="day-name">{dayName}</span>
                                <span className="day-number">{dayNumber}</span>
                                {isToday && <span className="today-label">Today</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="duration-selector">
                <h4 className="selector-title">
                    <Clock size={18}/>
                    Service Duration
                </h4>
                <div className="duration-controls">
                    <div className="duration-options">
                        {durationOptions.map((option) => (
                            <button
                                key={option.value}
                                className={`duration-option ${duration === option.value ? 'selected' : ''}`}
                                onClick={() => handleDurationChange(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <div className="custom-duration">
                        <label className="duration-label">Custom Duration:</label>
                        <div className="duration-input-group">
                            <button
                                className="duration-btn"
                                onClick={() => handleDurationChange(Math.max(0.5, duration - 0.5))}
                                disabled={duration <= 0.5}
                                type="button"
                            >
                                <Minus size={16}/>
                            </button>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => handleDurationChange(Math.max(0.5, Math.min(8, parseFloat(e.target.value) || 0.5)))}
                                className="duration-input"
                                min="0.5"
                                max="8"
                                step="0.5"
                            />
                            <span className="duration-unit">hours</span>
                            <button
                                className="duration-btn"
                                onClick={() => handleDurationChange(Math.min(8, duration + 0.5))}
                                disabled={duration >= 8}
                                type="button"
                            >
                                <Plus size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="time-selector">
                <h4 className="selector-title">
                    <Clock size={18}/>
                    Select Start Time
                </h4>
                <div className="time-grid">
                    {availableStartTimes.map((time, index) => (
                        <button
                            key={index}
                            className={`time-option ${selectedStartTime === time ? 'selected' : ''}`}
                            onClick={() => handleStartTimeSelect(time)}
                        >
                            {time}
                        </button>
                    ))}
                </div>

                {availableStartTimes.length === 0 && (
                    <div className="no-times-available">
                        <p>No available start times for {duration} hour duration</p>
                        <p>Try selecting a shorter duration or different date</p>
                    </div>
                )}
            </div>

            {selectedStartTime && selectedEndTime && (
                <div className="time-summary">
                    <h4 className="summary-title">Service Schedule</h4>
                    <div className="schedule-details">
                        <div className="schedule-item">
                            <span className="schedule-label">Start:</span>
                            <span className="schedule-value">{selectedStartTime}</span>
                        </div>
                        <div className="schedule-item">
                            <span className="schedule-label">End:</span>
                            <span className="schedule-value">{selectedEndTime}</span>
                        </div>
                        <div className="schedule-item">
                            <span className="schedule-label">Duration:</span>
                            <span className="schedule-value">{duration} {duration === 1 ? 'hour' : 'hours'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DateTimeSelector;