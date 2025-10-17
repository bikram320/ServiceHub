package org.example.QuestX.Controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.example.QuestX.dtos.EsewaInitiateResponse;
import org.example.QuestX.dtos.PaymentReleaseResponseDto;
import org.example.QuestX.services.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@RestController
@RequestMapping("/payments")
@AllArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    // 1) Initiate payment (protected — only authenticated users should call)
    @PostMapping("/initiate")
    public ResponseEntity<?> initiate(@RequestParam Long requestId, @RequestParam String  userEmail) {
        try {
            EsewaInitiateResponse resp = paymentService.initiatePayment(requestId, userEmail);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2) eSewa success callback — MUST be public (eSewa will redirect user here)
    // eSewa will supply amt, pid (our transactionId) and rid (esewa reference id)
    @GetMapping("/esewa/success")
    public ResponseEntity<String> esewaSuccess(@RequestParam("data") String data) {
        try {
            // Decode the Base64 data
            byte[] decodedBytes = Base64.getDecoder().decode(data);
            String decodedData = new String(decodedBytes);

            // Parse JSON (you'll need to add a JSON parsing library like Jackson or Gson)
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(decodedData);

            String status = jsonNode.get("status").asText();
            String totalAmount = jsonNode.get("total_amount").asText();
            String transactionUuid = jsonNode.get("transaction_uuid").asText();
            String transactionCode = jsonNode.get("transaction_code").asText();

            // Verify the payment using the extracted data
            boolean ok = paymentService.verifyEsewaPayment(totalAmount, transactionUuid, transactionCode);

            if (ok) {
                // Redirect to a success page in your frontend instead of returning plain text
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header("Location", "http://localhost:5173/payment/success")
                        .build();
            } else {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header("Location", "http://localhost:5173/payment/failure")
                        .build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", "http://localhost:5173/payment/failure")
                    .build();
        }
    }

    // 3) eSewa failure callback (public)
    @GetMapping("/esewa/failure")
    public ResponseEntity<String> esewaFailure() {
        return ResponseEntity.badRequest().body("Payment verification failed");
    }

}
