package org.example.QuestX.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Duration;

@Data
@AllArgsConstructor
public class TechnicianDashboardDto {
     long totalBookings;
     long activeBookings;
     long completedBookings;
     Double totalEarnings;
     Double averageRatingReceived;
     Duration averageResponseTime;
}
