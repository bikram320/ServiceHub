package org.example.QuestX.dtos;

import lombok.Data;
import org.example.QuestX.Model.ServiceStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ServiceAndUserDetailsDto{
    long requestId ;
    private  String username;
    private String  userAddress;
    private String userPhone;
    private String userEmail;
    private String serviceName;
    BigDecimal feeCharge;
    LocalDateTime appointmentTime;
    ServiceStatus status;
}
