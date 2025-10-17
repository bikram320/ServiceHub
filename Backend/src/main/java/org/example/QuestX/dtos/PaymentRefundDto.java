package org.example.QuestX.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@AllArgsConstructor
@Data
public class PaymentRefundDto {
    private long userId;
    private String username;
    private long paymentId;
    private BigDecimal amount;
}
