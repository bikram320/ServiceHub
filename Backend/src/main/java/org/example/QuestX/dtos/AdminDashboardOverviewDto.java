package org.example.QuestX.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardOverviewDto {
    private int totalUsers;
    private int activeTechnicians;
    private int pendingApprovals; // users + technicians pending
    private double monthlyRevenue;
    private double platformRating;
    private int activeServices;
}
