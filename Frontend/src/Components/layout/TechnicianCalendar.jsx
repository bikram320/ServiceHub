import React, { useState, useRef } from 'react';
import { Calendar, Clock, Trash2, X } from 'lucide-react';
import "../../styles/Calendar.css";

const TechnicianCalendar = ({
                                events = [],
                                onEventsChange,
                                error,
                                setError
                            }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: '',
        end: '',
        type: 'available',
        duration: 1
    });

    // Deadline for cancellation (24 hours before event)
    const CANCELLATION_DEADLINE_HOURS = 24;

    const calendarRef = useRef(null);

    // Helper function to check if event can be cancelled
    const canCancelEvent = (event) => {
        const now = new Date();
        const eventStart = new Date(event.start);
        const hoursUntilEvent = (eventStart.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursUntilEvent >= CANCELLATION_DEADLINE_HOURS;
    };

    // Helper function to convert Date to local datetime-local string
    const dateToLocalISOString = (date) => {
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return localDate.toISOString().slice(0, 16);
    };

    // Helper function to convert datetime-local string to Date
    const localISOStringToDate = (dateString) => {
        return new Date(dateString);
    };

    // Helper function to check if two time periods overlap
    const doTimePeriodsOverlap = (start1, end1, start2, end2) => {
        return start1 < end2 && end1 > start2;
    };

    // Function to check for event conflicts
    const checkEventConflict = (newStart, newEnd, excludeEventId = null) => {
        const newStartTime = new Date(newStart);
        const newEndTime = new Date(newEnd);

        const conflictingEvents = events.filter(event => {
            if (excludeEventId && event.id === excludeEventId) {
                return false;
            }

            if (event.type !== 'booked' && event.type !== 'blocked') {
                return false;
            }

            return doTimePeriodsOverlap(
                newStartTime,
                newEndTime,
                event.start,
                event.end
            );
        });

        return conflictingEvents;
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setEditingEvent(null);

        const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0);
        const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0);

        setNewEvent({
            title: '',
            start: dateToLocalISOString(startDate),
            end: dateToLocalISOString(endDate),
            type: 'available',
            duration: 1
        });
        setShowEventModal(true);
    };

    const handleEventClick = (event, e) => {
        e.stopPropagation();
        setEditingEvent(event);
        setNewEvent({
            title: event.title,
            start: dateToLocalISOString(event.start),
            end: dateToLocalISOString(event.end),
            type: event.type,
            duration: (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60)
        });
        setShowEventModal(true);
    };

    const handleStartTimeChangeWithConflictCheck = (startTime) => {
        const start = localISOStringToDate(startTime);
        const duration = newEvent.duration || 1;
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

        setNewEvent({
            ...newEvent,
            start: startTime,
            end: dateToLocalISOString(end)
        });

        setError(null);

        const conflicts = checkEventConflict(startTime, dateToLocalISOString(end), editingEvent?.id);
        if (conflicts.length > 0) {
            setError('Warning: This time conflicts with existing events.');
        }
    };

    const handleDurationChangeWithConflictCheck = (duration) => {
        if (newEvent.start) {
            const start = localISOStringToDate(newEvent.start);
            const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
            const endString = dateToLocalISOString(end);

            setNewEvent({
                ...newEvent,
                duration: duration,
                end: endString
            });

            setError(null);

            const conflicts = checkEventConflict(newEvent.start, endString, editingEvent?.id);
            if (conflicts.length > 0) {
                setError('Warning: This time conflicts with existing events.');
            }
        } else {
            setNewEvent({
                ...newEvent,
                duration: duration
            });
        }
    };

    const handleEventSubmit = (e) => {
        e.preventDefault();

        if (newEvent.title && newEvent.start && newEvent.end) {
            const startTime = localISOStringToDate(newEvent.start);
            const endTime = localISOStringToDate(newEvent.end);

            if (endTime <= startTime) {
                setError('End time must be after start time.');
                return;
            }

            const conflictingEvents = checkEventConflict(
                newEvent.start,
                newEvent.end,
                editingEvent?.id
            );

            if (conflictingEvents.length > 0) {
                const conflictTimes = conflictingEvents.map(event =>
                    `"${event.title}" (${event.start.toLocaleString()} - ${event.end.toLocaleString()})`
                ).join(', ');

                setError(`Time conflict detected! The selected time overlaps with: ${conflictTimes}`);
                return;
            }

            const eventData = {
                id: editingEvent ? editingEvent.id : events.length + 1,
                title: newEvent.title,
                start: startTime,
                end: endTime,
                type: newEvent.type,
            };

            let updatedEvents;
            if (editingEvent) {
                updatedEvents = events.map(event =>
                    event.id === editingEvent.id ? eventData : event
                );
            } else {
                updatedEvents = [...events, eventData];
            }

            onEventsChange(updatedEvents);

            setShowEventModal(false);
            setEditingEvent(null);
            setNewEvent({
                title: '',
                start: '',
                end: '',
                type: 'available',
                duration: 1
            });

            setError(null);
        }
    };

    const handleDeleteEvent = () => {
        if (editingEvent) {
            if (!canCancelEvent(editingEvent)) {
                setError(`Cannot cancel this event. Cancellation must be done at least ${CANCELLATION_DEADLINE_HOURS} hours before the scheduled time.`);
                return;
            }

            const updatedEvents = events.filter(event => event.id !== editingEvent.id);
            onEventsChange(updatedEvents);

            setShowEventModal(false);
            setEditingEvent(null);
            setNewEvent({
                title: '',
                start: '',
                end: '',
                type: 'available',
                duration: 1
            });
        }
    };

    const renderCalendar = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const firstDay = new Date(currentYear, currentMonth, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));

            const dayEvents = events.filter((event) =>
                event.start.toDateString() === date.toDateString()
            );

            days.push(
                <div
                    key={i}
                    className={`calendar-day ${date.getMonth() !== currentMonth ? 'other-month' : ''} ${date.toDateString() === today.toDateString() ? 'today' : ''}`}
                    onClick={() => handleDateClick(date)}
                >
                    <span className="day-number">{date.getDate()}</span>
                    {dayEvents.map(event => (
                        <div
                            key={event.id}
                            className={`event event-${event.type}`}
                            onClick={(e) => handleEventClick(event, e)}
                            title={`${event.title} - Click to edit`}
                        >
                            {event.title}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="calendar-container">
                <div className="calendar-header">
                    <h3>{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                </div>
                <div className="calendar-grid">
                    {dayNames.map(day => (
                        <div key={day} className="calendar-day-header">{day}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="calendar-section">
                <h4 className="calendar-title">
                    <Calendar size={18} style={{marginRight: '0.5rem'}} />
                    Schedule Calendar
                </h4>
                <p className="calendar-instructions">
                    Click on a date to add availability or click on existing events to edit/delete them.
                </p>
                {renderCalendar()}
            </div>

            {/* Event Modal */}
            {showEventModal && (
                <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
                            <button
                                className="modal-close-btn"
                                onClick={() => setShowEventModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {editingEvent && editingEvent.type === 'booked' && !canCancelEvent(editingEvent) && (
                            <div className="cancellation-warning">
                                ⚠️ This booking cannot be cancelled (less than {CANCELLATION_DEADLINE_HOURS} hours remaining)
                            </div>
                        )}

                        {error && error.includes('conflict') && (
                            <div className="conflict-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEventSubmit}>
                            <div className="form-group">
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                    placeholder="Enter event title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={newEvent.start}
                                    onChange={(e) => handleStartTimeChangeWithConflictCheck(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Duration (hours)</label>
                                <select
                                    className="form-select"
                                    value={newEvent.duration}
                                    onChange={(e) => handleDurationChangeWithConflictCheck(parseFloat(e.target.value))}
                                >
                                    <option value={0.5}>30 minutes</option>
                                    <option value={1}>1 hour</option>
                                    <option value={1.5}>1.5 hours</option>
                                    <option value={2}>2 hours</option>
                                    <option value={3}>3 hours</option>
                                    <option value={4}>4 hours</option>
                                    <option value={6}>6 hours</option>
                                    <option value={8}>8 hours</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={newEvent.end}
                                    onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                                    required
                                />
                                <small className="end-time-helper">
                                    End time will auto-update when you change duration or start time
                                </small>
                            </div>

                            <div className="form-group">
                                <label>Event Type</label>
                                <select
                                    className="form-select"
                                    value={newEvent.type}
                                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                                >
                                    <option value="available">Available</option>
                                    <option value="booked">Booked</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <div className="modal-actions-left">
                                    <button type="button" className="cancel-btn" onClick={() => setShowEventModal(false)}>
                                        Cancel
                                    </button>
                                    {editingEvent && (
                                        <button
                                            type="button"
                                            className={`delete-btn ${editingEvent.type === 'booked' && !canCancelEvent(editingEvent) ? 'disabled' : ''}`}
                                            onClick={handleDeleteEvent}
                                            disabled={editingEvent.type === 'booked' && !canCancelEvent(editingEvent)}
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <button type="submit" className="save-btn">
                                    {editingEvent ? 'Update Event' : 'Add Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TechnicianCalendar;