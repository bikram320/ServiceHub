package org.example.QuestX.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ServiceDashboardDto {
    long totalServices;
    long CompletedServices;
    long OngoingServices;
    long CancelledServices;
    long rejectedServices;
    long pendingServices;
}
