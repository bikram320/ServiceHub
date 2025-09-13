package org.example.QuestX.dtos;

import lombok.Data;
import org.example.QuestX.Model.ServiceStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ServiceRequestDetailsDto {
    Long requestId;
    String userName;
    String userEmail;
    String serviceName;
    String technicianName;
    String technicianEmail;
    String description;
    LocalDateTime appointmentTime;
    BigDecimal feeCharge;
    ServiceStatus status;
}
