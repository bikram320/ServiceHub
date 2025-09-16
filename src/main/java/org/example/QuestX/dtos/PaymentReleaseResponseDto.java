package org.example.QuestX.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PaymentReleaseResponseDto {
    private Long paymentId;
    private BigDecimal amount;
    private String technicianName;
    private String status;
    private LocalDateTime releasedAt;
}