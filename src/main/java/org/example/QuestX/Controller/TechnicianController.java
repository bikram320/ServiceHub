package org.example.QuestX.Controller;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Technician;
import org.example.QuestX.services.TechnicianService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
            @RequestParam(required = false) MultipartFile profile_image,
            @RequestParam(required = false) MultipartFile identity_doc,
            @RequestParam(required = false) MultipartFile valid_doc
            ) throws IOException {
        technicianService.technicianProfileSetup(email,phone,address,latitude,longitude,bio,profile_image,identity_doc,valid_doc);
        return ResponseEntity.ok("Technician Profile Updated");
    }

    @PostMapping("/accept-service-request")
    public ResponseEntity<?> acceptingServiceBooking(@RequestParam long requestId) throws MessagingException {
        technicianService.acceptingUserServiceRequest(requestId);
        return ResponseEntity.ok("Service Booking Accepted");
    }


}
