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
            @RequestParam(required = false) String phone ,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) MultipartFile profile_image,
            @RequestParam(required = false) MultipartFile valid_doc
    ) throws IOException {
        userService.UpdateProfileSetup(email , phone, address, latitude, longitude, profile_image, valid_doc);
        return ResponseEntity.ok("Profile Updated Successfully");
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
        var technicians = userService.getCurrentServiceBooking(userEmail);
        return ResponseEntity.ok(technicians);
    }

}
