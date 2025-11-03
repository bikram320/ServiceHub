package org.example.QuestX.services;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.example.QuestX.Model.*;
import org.example.QuestX.Repository.*;
import org.example.QuestX.dtos.*;
import org.example.QuestX.exception.ServiceNotFoundException;
import org.example.QuestX.exception.StatusInvalidException;
import org.example.QuestX.exception.TechnicianNotFoundException;
import org.example.QuestX.exception.UserNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;


@AllArgsConstructor
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;
    private final MailService mailService;
    private final AdminActionRepository adminActionRepository;
    private final AdminRepository adminRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final SkillRepository skillRepository;
    private final PaymentRepository paymentRepository;


    public AdminDashboardOverviewDto getDashboardOverview() {
        AdminDashboardOverviewDto overview = new AdminDashboardOverviewDto();

        // Total users (verified)
        overview.setTotalUsers((int) userRepository.countByStatus(Status.VERIFIED));

        // Active technicians
        overview.setActiveTechnicians((int) technicianRepository.countByStatus(Status.VERIFIED));

        // Pending approvals (users + technicians)
        int pendingUsers = (int) userRepository.countByStatus(Status.PENDING);
        int pendingTechnicians = (int) technicianRepository.countByStatus(Status.PENDING);
        overview.setPendingApprovals(pendingUsers + pendingTechnicians);

        // Monthly revenue (current month) - USE ENUM
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Double monthlyRevenue = serviceRequestRepository.sumFeeChargeByStatusAndDateAfter(ServiceStatus.COMPLETED, startOfMonth);
        overview.setMonthlyRevenue(monthlyRevenue != null ? monthlyRevenue : 0.0);

        // Platform rating (average of all completed services) - USE ENUM
        Double avgRating = serviceRequestRepository.averageRatingByStatus(ServiceStatus.COMPLETED);
        overview.setPlatformRating(avgRating != null ? avgRating : 0.0);

        // Active services (IN_PROGRESS or ACCEPTED) - USE ENUM LIST
        int activeServices = (int) serviceRequestRepository.countByStatusIn(
                Arrays.asList(ServiceStatus.IN_PROGRESS, ServiceStatus.ACCEPTED)
        );
        overview.setActiveServices(activeServices);

        return overview;
    }

    public List<RecentActivityDto> getRecentActivity() {
        List<RecentActivityDto> activities = new ArrayList<>();

        // Get recent users (last 24 hours)
        LocalDateTime last24Hours = LocalDateTime.now().minusHours(24);
        List<User> recentUsers = userRepository.findTop5ByCreatedAtAfterOrderByCreatedAtDesc(last24Hours);

        for (User user : recentUsers) {
            String timeAgo = calculateTimeAgo(user.getCreatedAt());
            activities.add(new RecentActivityDto(
                    "New user registered: " + user.getName(),
                    timeAgo,
                    "user"
            ));
        }

        // Get recent completed services - USE ENUM
        List<ServiceRequest> recentServices = serviceRequestRepository
                .findTop5ByStatusOrderByUpdatedAtDesc(ServiceStatus.COMPLETED)
                .stream()
                .limit(5)
                .collect(Collectors.toList());

        for (ServiceRequest service : recentServices) {
            String timeAgo = calculateTimeAgo(service.getUpdatedAt());
            activities.add(new RecentActivityDto(
                    "Service completed: " + service.getSkill().getName(), // Get skill name properly
                    timeAgo,
                    "success"
            ));
        }

        // Get recent technician applications - USE ENUM
        List<Technician> recentTechnicians = technicianRepository
                .findTop3ByStatusOrderByCreatedAtDesc(Status.PENDING)
                .stream()
                .limit(3)
                .toList();

        for (Technician tech : recentTechnicians) {
            String timeAgo = calculateTimeAgo(tech.getCreatedAt());
            activities.add(new RecentActivityDto(
                    "New technician application: " + tech.getName(),
                    timeAgo,
                    "pending"
            ));
        }

        // Sort by time and limit to 10
        activities.sort((a, b) -> compareTimeAgo(a.getTime(), b.getTime()));
        return activities.stream().limit(10).collect(Collectors.toList());
    }

    public Map<String, Object> getReportsSnapshot() {
        Map<String, Object> reports = new HashMap<>();

        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime yesterday = today.minusDays(1);

        // Daily revenue - USE ENUM
        Double todayRevenue = serviceRequestRepository.sumFeeChargeByStatusAndDateBetween(
                ServiceStatus.COMPLETED, today, LocalDateTime.now());
        Double yesterdayRevenue = serviceRequestRepository.sumFeeChargeByStatusAndDateBetween(
                ServiceStatus.COMPLETED, yesterday, today);

        double dailyRevenue = todayRevenue != null ? todayRevenue : 0.0;
        double revenueChange = calculatePercentageChange(dailyRevenue, yesterdayRevenue != null ? yesterdayRevenue : 0.0);

        reports.put("dailyRevenue", dailyRevenue);
        reports.put("revenueChange", String.format("+%.1f%%", revenueChange));

        // Completion rate - USE ENUM
        long totalServices = serviceRequestRepository.countByCreatedAtAfter(today);
        long completedServices = serviceRequestRepository.countByStatusAndCreatedAtAfter(ServiceStatus.COMPLETED, today);
        double completionRate = totalServices > 0 ? (completedServices * 100.0 / totalServices) : 0.0;

        reports.put("completionRate", String.format("%.1f%%", completionRate));
        reports.put("completionRateChange", "+2.1%");

        // User satisfaction (average rating) - USE ENUM
        Double avgRating = serviceRequestRepository.averageRatingByStatusAndDateAfter(ServiceStatus.COMPLETED, today);
        reports.put("userSatisfaction", avgRating != null ? String.format("%.1f/5", avgRating) : "0.0/5");
        reports.put("satisfactionChange", "+0.1");

        // Platform usage (percentage of verified users who booked today)
        long activeUsers = userRepository.countByStatus(Status.VERIFIED);
        long usersWhoBookedToday = serviceRequestRepository.countDistinctUsersByCreatedAtAfter(today);
        double platformUsage = activeUsers > 0 ? (usersWhoBookedToday * 100.0 / activeUsers) : 0.0;

        reports.put("platformUsage", String.format("%.1f%%", platformUsage));
        reports.put("platformUsageChange", "+5.3%");

        return reports;
    }

    // Helper methods
    private String calculateTimeAgo(LocalDateTime dateTime) {
        long minutes = ChronoUnit.MINUTES.between(dateTime, LocalDateTime.now());
        if (minutes < 60) return minutes + " min ago";

        long hours = ChronoUnit.HOURS.between(dateTime, LocalDateTime.now());
        if (hours < 24) return hours + "h ago";

        long days = ChronoUnit.DAYS.between(dateTime, LocalDateTime.now());
        return days + "d ago";
    }

    private int compareTimeAgo(String time1, String time2) {
        // Simple comparison - extract number
        int val1 = Integer.parseInt(time1.replaceAll("[^0-9]", ""));
        int val2 = Integer.parseInt(time2.replaceAll("[^0-9]", ""));
        return Integer.compare(val1, val2);
    }

    private double calculatePercentageChange(double current, double previous) {
        if (previous == 0) return current > 0 ? 100.0 : 0.0;
        return ((current - previous) / previous) * 100.0;
    }

    // Method related to Users
    public List<UserDataDto> getUsersRequest() {
        // when users sends request their status will be pending  so let pass pending
        return getUsersByStatus(Status.PENDING);

    }
    public List<UserDataDto> getActiveUsers() {
        // active users have status Verified so lets pass Verified as status
        return getUsersByStatus(Status.VERIFIED);
    }
    public List<UserDataDto> getRejectedUsers() {
        return getUsersByStatus(Status.REJECTED);
    }
    public List<UserDataDto> getBlockedUsers() {
        return getUsersByStatus(Status.BLOCKED);
    }

    public List<UserDataDto> getUsersByStatus(Status status) {
        List<User> users =  userRepository.findAllByStatus(status);
        if (users.isEmpty()) return Collections.emptyList();

        return users.stream()
                .map(user->{
                    BigDecimal totalPayments =
                            serviceRequestRepository.getTotalAmountSpentByUserAndStatuses(user, Arrays.asList(
                                    ServiceStatus.COMPLETED,
                                    ServiceStatus.IN_PROGRESS,
                                    ServiceStatus.ACCEPTED
                            ));
                    BigDecimal totalSpent =
                            serviceRequestRepository.getTotalAmountSpentByUserAndStatus(user, ServiceStatus.COMPLETED);
                    BigDecimal refunds =
                            serviceRequestRepository.getTotalAmountSpentByUserAndStatus(user, ServiceStatus.CANCELLED);

                    UserDataDto userData = new UserDataDto();
                    userData.setUsername(user.getName());
                    userData.setEmail(user.getEmail());
                    userData.setPhone(user.getPhone());
                    userData.setAddress(user.getAddress());
                    userData.setStatus(user.getStatus());
                    userData.setProfileImagePath(user.getProfileImagePath());
                    userData.setIsEmailVerified(user.getIsEmailVerified());
                    userData.setCreatedAt(user.getCreatedAt());
                    userData.setDocumentPath(user.getDocumentPath());
                    userData.setPaymentsMade(totalPayments != null ? totalPayments : BigDecimal.ZERO);
                    userData.setTotalSpent(totalSpent != null ? totalSpent : BigDecimal.ZERO);
                    userData.setRefunds(refunds != null ? refunds : BigDecimal.ZERO);
                    userData.setServicesUsed(
                            serviceRequestRepository.countByUserAndStatuses(
                                    user,
                                    Arrays.asList(ServiceStatus.COMPLETED)
                            ).intValue()
                    );
                    return userData;
                })
                .collect(Collectors.toList());
    }

    public void approveUserRequest(String email) throws MessagingException {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with email " + email + " not found")
        );
        if(user.getStatus().equals(Status.VERIFIED)) {
            throw new StatusInvalidException("User is already verified");
        } else if (user.getStatus().equals(Status.REJECTED)) {
            throw new StatusInvalidException("User is already rejected , Setup your profile with valid details ");
        }
        user.setStatus(Status.VERIFIED);
        mailService.sendMailtoUserAboutProfileVerification(email,Status.VERIFIED);
        userRepository.save(user);

        recordAdminAction(Status.VERIFIED, Role.TECHNICIAN ,
                user,"User has been Verified after Profile Review");

    }
    public void rejectUserRequest(String email) throws MessagingException {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with email " + email + " not found")
        );
        if(user.getStatus().equals(Status.VERIFIED)) {
            throw new StatusInvalidException("User is already verified. ");
        } else if (user.getStatus().equals(Status.REJECTED)) {
            throw new StatusInvalidException("User is already rejected ");
        }
        user.setStatus(Status.REJECTED);
        mailService.sendMailtoUserAboutProfileVerification(email,Status.REJECTED);
        userRepository.save(user);
        recordAdminAction(Status.REJECTED, Role.USER ,
                user,"User has been Rejected after Profile Review");
    }
    public void blockUser(String email) throws MessagingException {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with email " + email + " not found")
        );
        if(user.getStatus().equals(Status.BLOCKED)) {
            throw new StatusInvalidException("User is already blocked");
        }
        user.setStatus(Status.BLOCKED);
        mailService.sendMailtoUserAboutProfileVerification(email,Status.BLOCKED);
        userRepository.save(user);
        recordAdminAction(Status.BLOCKED, Role.USER ,
                user,"User has been Blocked by Admin");
    }

    public void unblockUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with email " + email + " not found")
        );
        if(!user.getStatus().equals(Status.BLOCKED)) {
            throw new StatusInvalidException("User is not blocked");
        }
        user.setStatus(Status.PENDING);
        userRepository.save(user);
        recordAdminAction(Status.PENDING, Role.USER ,
                user,"User has been Unblocked by Admin");
    }
    // methods related to Technician

    public List<TechnicianDataDto> getTechniciansRequest(){
        return getTechniciansByStatus(Status.PENDING);
    }
    public List<TechnicianDataDto> getActiveTechnicians() {
        return getTechniciansByStatus(Status.VERIFIED);
    }
    public List<TechnicianDataDto> getRejectedTechnicians() {
        return getTechniciansByStatus(Status.REJECTED);
    }
    public List<TechnicianDataDto> getBlockedTechnicians() {
        return getTechniciansByStatus(Status.BLOCKED);
    }
    public List<TechnicianDataDto> getTechniciansByStatus(Status status) {
        List<Technician> technicians =  technicianRepository.findAllByStatus(status);
        if(technicians.isEmpty()) {
            return Collections.emptyList();
        }
        return technicians.stream()
                .map(technician->{
                    TechnicianDataDto tech = new TechnicianDataDto();
                    tech.setName(technician.getName());
                    tech.setEmail(technician.getEmail());
                    tech.setPhone(technician.getPhone());
                    tech.setAddress(technician.getAddress());
                    tech.setStatus(technician.getStatus());
                    tech.setServiceCategory(String.valueOf(technician.getTechnicianSkills().stream()
                    .map(skill -> skill.getSkill().getName())
                            .collect(Collectors.toList())));
                    tech.setProfileImagePath(technician.getProfileImagePath());
                    tech.setIsEmailVerified(technician.getIsEmailVerified());
                    tech.setCreatedAt(technician.getCreatedAt());
                    tech.setDocumentPath(technician.getValidDocumentPath());
                    tech.setIdentityPath(technician.getIdentityPath());
                    return tech;
                })
                .collect(Collectors.toList());
    }

    public void approveTechnicianRequest(String email) throws MessagingException {
        Technician technician = technicianRepository.findByEmail(email);
        if (technician == null) {
            throw new TechnicianNotFoundException("Technician not found");
        }
        if(technician.getStatus().equals(Status.VERIFIED)) {
            throw new StatusInvalidException("Technician is already verified");
        } else if (technician.getStatus().equals(Status.REJECTED)) {
            throw new StatusInvalidException("Technician is already rejected , Setup your profile with valid details ");
        }
        technician.setStatus(Status.VERIFIED);
        mailService.sendMailtoUserAboutProfileVerification(email,Status.VERIFIED);
        technicianRepository.save(technician);

        recordAdminAction(Status.VERIFIED, Role.USER ,
                technician,"Technician has been Verified after Profile Review");

    }

    public void rejectTechnicianRequest(String email) throws MessagingException {
        Technician technician = technicianRepository.findByEmail(email);
        if (technician==null) {
            throw new TechnicianNotFoundException("Technician not found");
        }
        if(technician.getStatus().equals(Status.VERIFIED)) {
            throw new StatusInvalidException("Technician is already verified. ");
        } else if (technician.getStatus().equals(Status.REJECTED)) {
            throw new StatusInvalidException("Technician is already rejected ");
        }
        technician.setStatus(Status.REJECTED);
        mailService.sendMailtoUserAboutProfileVerification(email,Status.REJECTED);
        technicianRepository.save(technician);
        recordAdminAction(Status.REJECTED, Role.TECHNICIAN ,
                technician,"Technician has been Rejected after Profile Review");
    }
    public void blockTechnician(String email) throws MessagingException {
        Technician technician = technicianRepository.findByEmail(email);
        if( technician == null) {
            throw  new TechnicianNotFoundException("Technician with email " + email + " not found");
        }
        if(technician.getStatus().equals(Status.BLOCKED)) {
            throw new StatusInvalidException("Technician is already blocked");
        }
        technician.setStatus(Status.BLOCKED);
        mailService.sendMailtoUserAboutProfileVerification(email,Status.BLOCKED);
        technicianRepository.save(technician);
        recordAdminAction(Status.BLOCKED, Role.TECHNICIAN ,
                technician," Technician has been Blocked by Admin");
    }

    public void unblockTechnician(String email) {
        Technician technician = technicianRepository.findByEmail(email);
        if( technician == null) {
            throw  new TechnicianNotFoundException("Technician with email " + email + " not found");
        }
        if(!technician.getStatus().equals(Status.BLOCKED)) {
            throw new StatusInvalidException("Technician is not blocked");
        }
        technician.setStatus(Status.PENDING);
        technicianRepository.save(technician);
        recordAdminAction(Status.PENDING, Role. TECHNICIAN ,
                technician,"Technician has been Unblocked by Admin");
    }

    public List<TechnicianServiceCategoryDto> getTechnicianServiceCategories() {
        List<Skill> skill = skillRepository.findAll();
        if(skill.isEmpty()) {
            throw new ServiceNotFoundException("There are no service categories available");
        }
        return skill.stream()
                .map(s -> {
                    TechnicianServiceCategoryDto dto = new TechnicianServiceCategoryDto();
                    dto.setServiceCategory(s.getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public void recordAdminAction
            (Status actionType, Role target,
             JwtUser jwtUser , String description
            ){
        //Store the Action that has been Performed by Admin
        AdminAction adminAction = new AdminAction();

        // let Retrieve admin first (id=1 , cause admin is only one)
        Admin admin = adminRepository.findById((long)1).orElseThrow(
                ()-> new UserNotFoundException("Admin not found")
        );

        adminAction.setAdmin(admin);
        adminAction.setActionType(actionType);
        adminAction.setTargetType(target);
        adminAction.setTargetId(jwtUser.getId());
        adminAction.setDescription(description);
        adminAction.setCreatedAt(LocalDateTime.now());
        adminActionRepository.save(adminAction);
    }

    public List<ServiceRequestDetailsDto> getAllServiceRequests() {
        List<ServiceRequest> serviceRequests = serviceRequestRepository.findAll();
        if(serviceRequests.isEmpty()) {
            throw new ServiceNotFoundException("There are no serviceRequests to track");
        }

        return serviceRequests.stream()
                .map(serviceRequest ->
                        {
                            ServiceRequestDetailsDto serviceDetails = new ServiceRequestDetailsDto();
                            serviceDetails.setRequestId(serviceRequest.getId());
                            serviceDetails.setPaymentId(serviceRequest.getPayment().getId());
                            serviceDetails.setUserName(serviceRequest.getUser().getName());
                            serviceDetails.setUserEmail(serviceRequest.getUser().getEmail());
                            serviceDetails.setServiceName(serviceRequest.getSkill().getName());
                            serviceDetails.setTechnicianName(serviceRequest.getTechnician().getName());
                            serviceDetails.setTechnicianEmail(serviceRequest.getTechnician().getEmail());
                            serviceDetails.setDescription(serviceRequest.getDescription());
                            serviceDetails.setStatus(serviceRequest.getStatus());
                            serviceDetails.setAppointmentTime(serviceRequest.getAppointmentTime());
                            serviceDetails.setFeeCharge(serviceRequest.getFeeCharged());
                            serviceDetails.setPaymentStatus(serviceRequest.getPayment().getStatus());
                            return serviceDetails;
                        }
                )
                .collect(Collectors.toList());

    }

    public ServiceDashboardDto getServiceDashboard() {
        long totalServices = serviceRequestRepository.count();
        long completedServices = countServicesByStatus(ServiceStatus.COMPLETED);
        long ongoingServices = countServicesByStatus(ServiceStatus.IN_PROGRESS);
        long cancelledServices = countServicesByStatus(ServiceStatus.CANCELLED);
        long rejectedServices = countServicesByStatus(ServiceStatus.REJECTED);
        long pendingServices = countServicesByStatus(ServiceStatus.PENDING);
        ServiceDashboardDto dashboard = new ServiceDashboardDto();
        dashboard.setPendingServices(pendingServices);
        dashboard.setTotalServices(totalServices);
        dashboard.setCompletedServices(completedServices);
        dashboard.setOngoingServices(ongoingServices);
        dashboard.setCancelledServices(cancelledServices);
        dashboard.setRejectedServices(rejectedServices);
        return dashboard;

    }
    public long countServicesByStatus(ServiceStatus status) {
        return serviceRequestRepository.countByStatus(status);
    }

    public PaymentReleaseResponseDto releasePayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.HOLD) {
            throw new StatusInvalidException("Payment is not in HOLD state, cannot release.");
        }

        // ✅ Mark payment as released
        payment.setStatus(PaymentStatus.RELEASED);
        payment.setReleasedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // ✅ Update technician earnings
        Technician tech = payment.getTech();
        if (tech != null) {
            BigDecimal newEarnings = tech.getEarnedAmount().add(payment.getAmount());
            tech.setEarnedAmount(newEarnings);
            technicianRepository.save(tech);
        }

        // ✅ Return clean DTO instead of entity
        return new PaymentReleaseResponseDto(
                payment.getId(),
                payment.getAmount(),
                payment.getTech() != null ? payment.getTech().getName() : null,
                payment.getStatus().name(),
                payment.getReleasedAt()
        );
    }

    public PaymentRefundDto refundPayment(Long paymentId) {
            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));
            if (payment.getStatus() != PaymentStatus.HOLD) {
                throw new StatusInvalidException("Payment is not in HOLD state, cannot refund.");
            }
            payment.setStatus(PaymentStatus.REFUNDED);
            payment.setRefundedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            return new PaymentRefundDto(
                    payment.getUser().getId(),
                    payment.getUser().getName(),
                    payment.getId(),
                    payment.getAmount()
            );
    }


}
