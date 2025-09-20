package org.example.QuestX.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UserDashboardOverviewDto {
    Long upcomingBookings;
    Long completedServices;
    Double averageRatingGiven;
    BigDecimal totalSpent;
}
