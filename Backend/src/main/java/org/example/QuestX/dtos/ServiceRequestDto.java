package org.example.QuestX.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ServiceRequestDto {

    @NotBlank(message = "user  email is required")
    @Email
    String userEmail;

    @NotBlank(message = "technician email is required")
    @Email
    String technicianEmail;

    @NotBlank(message = "Service Name is required")
    String serviceName;

    @NotBlank(message = "description must be provided")
    String description;

    @NotBlank(message = "appointment Time must be provided")
    LocalDateTime appointmentTime;

    @NotBlank(message = "Fee charged must be provided")
    @Positive(message = "Fee must be in Positive")
    BigDecimal feeCharge;
}
