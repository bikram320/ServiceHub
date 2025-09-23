package org.example.QuestX.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TechnicianProfileRequestDto {
    String technicianName;
    String technicianEmail;
    String technicianAddress;
    String technicianPhone;
    String technicianBio;
    String serviceName;
    String profileImagePath;
    BigDecimal technicianRating;
    BigDecimal feeCharge;
}
