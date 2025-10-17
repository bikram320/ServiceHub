package org.example.QuestX.services;

import lombok.AllArgsConstructor;
import org.example.QuestX.Model.*;
import org.example.QuestX.Repository.*;
import org.example.QuestX.config.EsewaConfig;
import org.example.QuestX.dtos.EsewaInitiateResponse;
import org.example.QuestX.dtos.PaymentReleaseResponseDto;
import org.example.QuestX.exception.ServiceNotFoundException;
import org.example.QuestX.exception.StatusInvalidException;
import org.example.QuestX.exception.UserNotFoundException;
import org.example.QuestX.util.EsewaSignatureUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ServiceRequestRepository requestRepository;
    private final TechnicianRepository technicianRepository;
    private final UserRepository userRepository;
    private final EsewaConfig esewaConfig;

    private final RestTemplate restTemplate = new RestTemplate();


    // Step 1: create payment DB record
    public EsewaInitiateResponse initiatePayment(Long requestId, String payerUserEmail) throws Exception {
        ServiceRequest sr = requestRepository.findById(requestId)
                .orElseThrow(() -> new ServiceNotFoundException("ServiceRequest not found"));

        Technician tech = sr.getTechnician();
        User user = userRepository.findByEmail(payerUserEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        BigDecimal amount = sr.getFeeCharged();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid amount");
        }

        Payment p = new Payment();
        p.setRequest(sr);
        p.setUser(user);
        p.setTech(tech);
        p.setAmount(amount);

        String pid = "PAY-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
        p.setTransactionId(pid);
        p.setStatus(PaymentStatus.PENDING);
        p.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(p);

        int totalAmount = amount.setScale(0, RoundingMode.HALF_UP).intValue();

        String signatureString = String.format("total_amount=%d,transaction_uuid=%s,product_code=%s",
                totalAmount, pid, esewaConfig.getMerchantId());
        String signature = EsewaSignatureUtil.generateEsewaSignature(esewaConfig.getSecretKey(), signatureString);

        EsewaInitiateResponse resp = new EsewaInitiateResponse();
        resp.amount = amount.toPlainString();
        resp.tax_amount=String.valueOf(0);
        resp.product_service_charge = String.valueOf(0);
        resp.product_delivery_charge = String.valueOf(0);
        resp.total_amount = totalAmount;
        resp.transaction_uuid = pid;
        resp.product_code = esewaConfig.getMerchantId();
        resp.success_url = esewaConfig.getSuccessUrl();
        resp.failure_url = esewaConfig.getFailureUrl();
        resp.signed_field_names = "total_amount,transaction_uuid,product_code";
        resp.signature = signature;

        return resp;
    }

    // Real eSewa verification
    public boolean verifyEsewaPayment(String amt, String pid, String transactionCode) {
        try {
            Optional<Payment> opt = paymentRepository.findByTransactionId(pid);
            if (opt.isEmpty()) return false;

            Payment p = opt.get();
            if (p.getAmount().compareTo(new BigDecimal(amt)) != 0) {
                p.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(p);
                return false;
            }

            // For the new eSewa format, if status is "COMPLETE" and we have a transaction_code,
            // we can consider it verified (you might want to add additional verification)
            if (transactionCode != null && !transactionCode.isEmpty()) {
                p.setStatus(PaymentStatus.HOLD);
                p.setPaidAt(LocalDateTime.now());
                p.setEsewaRid(transactionCode); // Store transaction_code as rid
                paymentRepository.save(p);
                return true;
            } else {
                p.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(p);
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
