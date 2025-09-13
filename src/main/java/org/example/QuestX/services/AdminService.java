package org.example.QuestX.services;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.*;
import org.example.QuestX.Repository.AdminActionRepository;
import org.example.QuestX.Repository.AdminRepository;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.Repository.UserRepository;
import org.example.QuestX.dtos.TechnicianDataDto;
import org.example.QuestX.dtos.UserDataDto;
import org.example.QuestX.exception.StatusInvalidException;
import org.example.QuestX.exception.TechnicianNotFoundException;
import org.example.QuestX.exception.UserNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;
    private final MailService mailService;
    private final AdminActionRepository adminActionRepository;
    private final AdminRepository adminRepository;


    // Method related to Users
    public List<UserDataDto> getUsersRequest() {
        // when users sends request their status will be pending  so let pass pending
        return getUsersByStatus(Status.PENDING);

    }
    public List<UserDataDto> getActiveUsers() {
        // active users have status Verified so lets pass Verified as status
        return getUsersByStatus(Status.VERIFIED);
    }

    public List<UserDataDto> getUsersByStatus(Status status) {
        List<User> user =  userRepository.findAllByStatus(status);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        return user.stream()
                .map(users->{
                    UserDataDto userData = new UserDataDto();
                    userData.setUsername(users.getName());
                    userData.setEmail(users.getEmail());
                    userData.setPhone(users.getPhone());
                    userData.setAddress(users.getAddress());
                    userData.setProfileImagePath(users.getProfileImagePath());
                    userData.setIsEmailVerified(users.getIsEmailVerified());
                    userData.setCreatedAt(users.getCreatedAt());
                    userData.setDocumentPath(users.getDocumentPath());
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

        recordAdminAction(Status.VERIFIED, Role.USER ,
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

    // methods related to Technician

    public List<TechnicianDataDto> getTechniciansRequest(){
        return getTechniciansByStatus(Status.PENDING);
    }
    public List<TechnicianDataDto> getActiveTechnicians() {
        return getTechniciansByStatus(Status.VERIFIED);
    }
    public List<TechnicianDataDto> getTechniciansByStatus(Status status) {
        List<Technician> technicians =  technicianRepository.findAllByStatus(status);
        if(technicians.isEmpty()) {
            throw new TechnicianNotFoundException("Technician not found");
        }
        return technicians.stream()
                .map(technician->{
                    TechnicianDataDto tech = new TechnicianDataDto();
                    tech.setName(technician.getName());
                    tech.setEmail(technician.getEmail());
                    tech.setPhone(technician.getPhone());
                    tech.setAddress(technician.getAddress());
                    tech.setProfileImagePath(technician.getProfileImagePath());
                    tech.setIsEmailVerified(technician.getIsEmailVerified());
                    tech.setCreatedAt(technician.getCreatedAt());
                    tech.setDocumentPath(technician.getValidDocumentPath());
                    tech.setIdentityPath(technician.getIdentityPath());
                    return tech;
                })
                .collect(Collectors.toList());
    }

}
