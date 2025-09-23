package org.example.QuestX.Controller;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.QuestX.dtos.PaymentDetailsDto;
import org.example.QuestX.dtos.ServiceAndUserDetailsDto;
import org.example.QuestX.services.TechnicianService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/technician")
public class TechnicianController {

    private final TechnicianService technicianService;

    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfile(
            @RequestParam String email,
            @RequestParam(required = false) String phone ,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String serviceType,
            @RequestParam(required = false) Double feeCharged,
            @RequestParam(required = false) MultipartFile profile_image,
            @RequestParam(required = false) MultipartFile identity_doc,
            @RequestParam(required = false) MultipartFile valid_doc
            ) throws IOException {
        technicianService.technicianProfileSetup(email,phone,address,latitude,longitude,bio ,profile_image, serviceType , feeCharged,identity_doc,valid_doc);
        return ResponseEntity.ok("Technician Profile Updated");
    }
    @GetMapping("/get-current-request")
    public ResponseEntity<?> getCurrentRequest(@RequestParam String email) {
        List<ServiceAndUserDetailsDto> currentRequest = technicianService.getCurrentRequest(email);
        return ResponseEntity.ok(currentRequest);
    }
    @GetMapping("/dashboard-overview")
    public ResponseEntity<?> getDashboardOverview(@RequestParam String email) {
        return ResponseEntity.ok(technicianService.getTechnicianDashboardOverview(email));
    }
    @GetMapping("/profile")
    public ResponseEntity<?> GetProfile(@RequestParam String email) {
        return ResponseEntity.ok(technicianService.getProfile(email));
    }
    @GetMapping("/get-previous-request")
    public ResponseEntity<?> getPreviousRequest(@RequestParam String email) {
        List<ServiceAndUserDetailsDto> previousRequest = technicianService.getPreviousRequest(email);
        return ResponseEntity.ok(previousRequest);
    }

    @PostMapping("/accept-service-request")
    public ResponseEntity<?> acceptingServiceBooking(@RequestParam long requestId) throws MessagingException {
        technicianService.acceptingUserServiceRequest(requestId);
        return ResponseEntity.ok("Service Booking Accepted");
    }

    @PostMapping("/reject-service-request")
    public ResponseEntity<?> rejectingServiceBooking(@RequestParam long requestId) throws MessagingException {
        technicianService.rejectingUserServiceRequest(requestId);
        return ResponseEntity.ok("Service Booking Rejected");
    }

    @GetMapping("/pending-payments")
    public ResponseEntity<?> getPendingPayment(@RequestParam String email) {
        List<PaymentDetailsDto> paymentDetails = technicianService.getPendingPayments(email);
        return ResponseEntity.ok(paymentDetails);
    }

    @GetMapping("/received-payments")
    public ResponseEntity<?> getReceivedPayment(@RequestParam String email) {
        List<PaymentDetailsDto> paymentDetails = technicianService.getReceivedPayments(email);
        return ResponseEntity.ok(paymentDetails);
    }

}
