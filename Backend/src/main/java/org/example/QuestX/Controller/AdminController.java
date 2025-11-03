package org.example.QuestX.Controller;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.QuestX.dtos.*;
import org.example.QuestX.services.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;


    @GetMapping("/dashboard-overview")
    public ResponseEntity<?> getDashboardOverview() {
        AdminDashboardOverviewDto overview = adminService.getDashboardOverview();
        return new ResponseEntity<>(overview, HttpStatus.OK);
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<?> getRecentActivity() {
        List<RecentActivityDto> activities = adminService.getRecentActivity();
        return new ResponseEntity<>(activities, HttpStatus.OK);
    }

    @GetMapping("/reports-snapshot")
    public ResponseEntity<?> getReportsSnapshot() {
        Map<String, Object> reports = adminService.getReportsSnapshot();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

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
    @GetMapping("/users-rejected")
    public ResponseEntity<?> getRejectedUsers() {
        List<UserDataDto> rejectedUsers = adminService.getRejectedUsers();
        return new ResponseEntity<>(rejectedUsers, HttpStatus.OK);
    }
    @GetMapping("/users-blocked")
    public ResponseEntity<?> getBlockedUsers() {
        List<UserDataDto> blockedUsers = adminService.getBlockedUsers();
        return new ResponseEntity<>(blockedUsers, HttpStatus.OK);
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

    @PostMapping("/users-block")
    public ResponseEntity<?> blockUser(@RequestParam String email) throws MessagingException {
        adminService.blockUser(email);
        return ResponseEntity.ok("User has been blocked");
    }

    @PostMapping("/users-unblock")
    public ResponseEntity<?> unblockUser(@RequestParam String email)  {
        adminService.unblockUser(email);
        return ResponseEntity.ok("User has been unblocked");
    }

    //methods related to Technicians

    @GetMapping("/technicians-request")
    public ResponseEntity<?> getTechniciansRequest() {
        List<TechnicianDataDto> technicianRequest = adminService.getTechniciansRequest();
        return new ResponseEntity<>(technicianRequest, HttpStatus.OK);
    }

    @GetMapping("/technicians-active")
    public ResponseEntity<?> getActiveTechnicians(){
        List<TechnicianDataDto> activeTechnicians = adminService.getActiveTechnicians();
        return new ResponseEntity<>(activeTechnicians, HttpStatus.OK);
    }

    @GetMapping("/technicians-rejected")
    public ResponseEntity<?> getTechniciansRejected(){
        List<TechnicianDataDto> rejectedTechnicians = adminService.getRejectedTechnicians();
        return new ResponseEntity<>(rejectedTechnicians, HttpStatus.OK);
    }

    @GetMapping("/technicians-blocked")
    public ResponseEntity<?> getBlockedTechnicians(){
        List<TechnicianDataDto> blockedTechnicians = adminService.getBlockedTechnicians();
        return new ResponseEntity<>(blockedTechnicians, HttpStatus.OK);
    }

    @PostMapping("/technician-request-approved")
    public ResponseEntity<?> technicianRequestApproved(@RequestParam String email) throws MessagingException {
        adminService.approveTechnicianRequest(email);
        return ResponseEntity.ok("Technician Request Approved");
    }
    @PostMapping("/technician-request-rejected")
    public ResponseEntity<?> technicianRequestRejected(@RequestParam String email) throws MessagingException {
        adminService.rejectTechnicianRequest(email);
        return ResponseEntity.ok("Technician Request Rejected");
    }

    @PostMapping("/technicians-block")
    public ResponseEntity<?> blockTechnicians(@RequestParam String email) throws MessagingException {
        adminService.blockTechnician(email);
        return ResponseEntity.ok("User has been blocked");
    }

    @PostMapping("/technician-unblock")
    public ResponseEntity<?> unblockTechnicians(@RequestParam String email)  {
        adminService.unblockTechnician(email);
        return ResponseEntity.ok("User has been unblocked");
    }

    @GetMapping("/technician-service-categories")
    public ResponseEntity<?> technicianServiceCategory() {
        List<TechnicianServiceCategoryDto> technicianServiceCategories = adminService.getTechnicianServiceCategories();
        return new ResponseEntity<>(technicianServiceCategories, HttpStatus.OK);
    }

    //Services and payments related methods

    @GetMapping("/service-dashboard")
    public ResponseEntity<?> serviceDashboard() {
        ServiceDashboardDto serviceDashboardDto = adminService.getServiceDashboard();
        return new ResponseEntity<>(serviceDashboardDto, HttpStatus.OK);
    }
    @GetMapping("/track-service-request")
    public ResponseEntity<?> trackServiceRequest(){
        List<ServiceRequestDetailsDto> serviceRequestDetails = adminService.getAllServiceRequests();
        return new ResponseEntity<>(serviceRequestDetails, HttpStatus.OK);
    }

    @PostMapping("/release/{paymentId}")
    public ResponseEntity<?> release(@PathVariable Long paymentId) {
            PaymentReleaseResponseDto releasePayment = adminService.releasePayment(paymentId);
            return new ResponseEntity<>(releasePayment, HttpStatus.OK);
    }

    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<?> refund(@PathVariable Long paymentId) {
            PaymentRefundDto refundPayment= adminService.refundPayment(paymentId);
            return new ResponseEntity<>(refundPayment, HttpStatus.OK);
    }

}
