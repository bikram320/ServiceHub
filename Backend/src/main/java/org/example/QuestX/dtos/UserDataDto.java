package org.example.QuestX.dtos;

import lombok.Data;
import org.example.QuestX.Model.Status;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class UserDataDto {
    private String username;
    private String email;
    private String phone ;
    private String address;
    private Boolean isEmailVerified;
    private String profileImagePath;
    private String documentPath;
    private Status status;
    private LocalDateTime createdAt;
    private BigDecimal paymentsMade;
    private BigDecimal refunds;
    private int servicesUsed;
    private BigDecimal totalSpent;
}
