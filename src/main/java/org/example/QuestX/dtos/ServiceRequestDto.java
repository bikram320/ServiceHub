package org.example.QuestX.dtos;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ServiceRequestDto {

    String userEmail;
    String technicianEmail;
    String serviceName;
    String description;
    LocalDateTime appointmentTime;
    BigDecimal feeCharge;
}
