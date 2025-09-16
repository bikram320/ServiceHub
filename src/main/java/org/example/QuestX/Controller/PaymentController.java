package org.example.QuestX.Controller;

import lombok.AllArgsConstructor;
import org.example.QuestX.dtos.EsewaInitiateResponse;
import org.example.QuestX.dtos.PaymentReleaseResponseDto;
import org.example.QuestX.services.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@AllArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    // 1) Initiate payment (protected — only authenticated users should call)
    @PostMapping("/initiate")
    public ResponseEntity<?> initiate(@RequestParam Long requestId, @RequestParam Long userId) {
        try {
            EsewaInitiateResponse resp = paymentService.initiatePayment(requestId, userId);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2) eSewa success callback — MUST be public (eSewa will redirect user here)
    // eSewa will supply amt, pid (our transactionId) and rid (esewa reference id)
    @GetMapping("/esewa/success")
    public ResponseEntity<String> esewaSuccess(@RequestParam("amt") String amt,
                                               @RequestParam("pid") String pid,
                                               @RequestParam("rid") String rid) {
        boolean ok = paymentService.verifyEsewaPayment(amt, pid, rid);
        if (ok) {
            return ResponseEntity.ok("Payment verified successfully");
        } else {
            return ResponseEntity.badRequest().body("Payment verification failed");
        }
    }

    // 3) eSewa failure callback (public)
    @GetMapping("/esewa/failure")
    public ResponseEntity<String> esewaFailure() {
        return ResponseEntity.badRequest().body("Payment verification failed");
    }

    // 4) Release payment (protected — call when service complete)
    @PostMapping("/release/{id}")
    public ResponseEntity<?> release(@PathVariable Long id) {
        try {
            PaymentReleaseResponseDto p = paymentService.releasePayment(id);
            return ResponseEntity.ok(p);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
