import React, { useState } from "react";
import {Shield} from "lucide-react";
import "../../styles/BookingDetail.css"

const BookingPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        contactNumber: "",
        address: "",
        selectedDate:"",
        selectedTime:"",
        notes: ""
    });

    const [selectedDate, setSelectedDate] = useState(6); //deafult to saturday/6th day
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev =>({
            ...prev,
            [name]: value
        }));
    };

    const timeSlots = [
        '9AM-10AM',
        '10AM-11AM',
        '11AM-12PM',
        '12PM-1PM',
        '1PM-2PM',
        '2PM-3PM',
        '3PM-4PM',
        '4PM-5PM'
    ];

    const calendar = [
        {

        }
    ]

    return(
        <div className="booking-container">
            <div className="booking-form">
                <h2 className="form-title">Bookings Information:</h2>

                {/*Personal Information*/}
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                    <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>

                {/*Date selection */}

                <div className="form-group">
                    <label htmlFor="notes" className="form-label">Notes(Optional)</label>
                    <textarea
                        name="name"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows="4"
                        placeholder="Any additional notes or special requirements..."
                    />
                </div>
            </div>
        </div>
    )
}

export default BookingPage;