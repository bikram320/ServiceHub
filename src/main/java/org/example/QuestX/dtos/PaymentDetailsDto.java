package org.example.QuestX.dtos;

import lombok.Data;
import org.example.QuestX.Model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDetailsDto {
    Long UserId;
    String UserName;
    String serviceName;
    LocalDateTime serviceDate;
    BigDecimal amount;
    PaymentStatus status;
}
