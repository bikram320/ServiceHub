package org.example.QuestX.Controller;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.AdminAction;
import org.example.QuestX.Model.Status;
import org.example.QuestX.Model.User;
import org.example.QuestX.Repository.AdminActionRepository;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.Repository.UserRepository;
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
        List<UserDataDto> userRequests = adminService.getUserRequest();
        return new ResponseEntity<>(userRequests, HttpStatus.OK);
    }

    @PostMapping("/users-request-approved")
    public ResponseEntity<?> userRequestApproved(@RequestParam String email) throws MessagingException {
        adminService.approveUserRequest(email);
        return ResponseEntity.ok("User Profile Approved");
    }

}
