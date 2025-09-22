package org.example.QuestX.dtos;

import lombok.Data;
import org.example.QuestX.Model.ServiceStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ServiceAndTechnicianDetailsDto {
    long requestId ;
    String technicianName;
    String technicianAddress;
    String technicianEmail;
    String serviceName;
    BigDecimal feeCharge;
    LocalDateTime appointmentTime;
    ServiceStatus status;
}
