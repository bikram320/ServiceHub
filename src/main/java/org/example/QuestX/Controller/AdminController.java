package org.example.QuestX.Controller;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.QuestX.dtos.TechnicianDataDto;
import org.example.QuestX.dtos.UserDataDto;
import org.example.QuestX.services.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users-request")
    public  ResponseEntity<?> userRequest(){
        List<UserDataDto> userRequests = adminService.getUsersRequest();
        return new ResponseEntity<>(userRequests, HttpStatus.OK);
    }

    @GetMapping("/users-active")
    public ResponseEntity<?> getActiveUsers() {
        List<UserDataDto> activeUsers = adminService.getActiveUsers();
        return new ResponseEntity<>(activeUsers, HttpStatus.OK);
    }

    @PostMapping("/users-request-approved")
    public ResponseEntity<?> userRequestApproved(@RequestParam String email) throws MessagingException {
        adminService.approveUserRequest(email);
        return ResponseEntity.ok("User Profile Approved");
    }
    @PostMapping("/users-request-rejected")
    public ResponseEntity<?> userRequestRejected(@RequestParam String email) throws MessagingException {
        adminService.rejectUserRequest(email);
        return ResponseEntity.ok("User Profile Rejected");
    }

    //methods related to Technicians

    @GetMapping("/technicians-request")
    public ResponseEntity<?> techniciansRequest(){
        List<TechnicianDataDto> technicianRequest = adminService.getTechniciansRequest();
        return new ResponseEntity<>(technicianRequest, HttpStatus.OK);
    }

    @GetMapping("/technicians-active")
    public ResponseEntity<?> techniciansActive(){
        List<TechnicianDataDto> activeTechnicians = adminService.getActiveTechnicians();
        return new ResponseEntity<>(activeTechnicians, HttpStatus.OK);
    }

}
