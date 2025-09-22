package org.example.QuestX.Controller;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.QuestX.dtos.ServiceRequestDto;
import org.example.QuestX.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@AllArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/update-profile")
    public ResponseEntity<?> UpdateProfileSetup(
            @RequestParam String email,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone ,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) MultipartFile profile_image,
            @RequestParam(required = false) MultipartFile valid_doc
    ) throws IOException {
        userService.UserProfileSetup(email , name, phone, address, latitude, longitude, profile_image, valid_doc);
        return ResponseEntity.ok("Profile Updated Successfully");
    }

    @GetMapping("/profile")
    public ResponseEntity<?> GetProfile(@RequestParam String email) {
        return ResponseEntity.ok(userService.getProfile(email));
    }

    @GetMapping("/dashboard-overview")
    public ResponseEntity<?> getDashboardOverview(@RequestParam String email) {
        return ResponseEntity.ok(userService.getUserDashboardOverview(email));
    }

    @GetMapping("/get-technicians-based-on-skill")
    public ResponseEntity<?> getTechniciansBasedOnSkill(@RequestParam String skill) {
        var technician= userService.getTechnicianBasedOnSkill(skill);
        return ResponseEntity.ok(technician);
    }

    @PostMapping("/book-technician-for-service")
    public ResponseEntity<?> bookTechnicianForService(@RequestBody ServiceRequestDto request)
    throws MessagingException {
        userService.bookTechnicianForService(request);
        return ResponseEntity.ok("Technician Booked Successfully");
    }
    @GetMapping("/get-current-service-booking")
    public ResponseEntity<?> getCurrentServiceBooking(@RequestParam String userEmail) {
        var currentServiceDetails = userService.getCurrentServiceBooking(userEmail);
        return ResponseEntity.ok(currentServiceDetails);
    }
    @GetMapping("/get-previous-service-booking")
    public ResponseEntity<?> getPreviousServiceBooking(@RequestParam String userEmail) {
        var previousServiceDetails = userService.getPreviousServiceBooking(userEmail);
        return ResponseEntity.ok(previousServiceDetails);
    }

    @PostMapping("/cancel-pending-service-booking")
    public ResponseEntity<?> cancelPendingServiceBooking(@RequestParam String userEmail ,
                                                         @RequestParam Long requestId) {
        userService.UserCancelServiceBooking(userEmail,requestId);
        return ResponseEntity.ok("Service Booking Cancelled");
    }

    @PostMapping("/user-feedback")
    public ResponseEntity<?> userFeedbackToTechnician(
            @RequestParam Float rating,
            @RequestParam long requestId,
            @RequestParam long userId ,
            @RequestParam String comment
    ){
        userService.userFeedbackToTechnician(rating , requestId, userId , comment);
        return ResponseEntity.ok("Feedback Successfully Made");
    }


}
