package org.example.QuestX.services;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Status;
import org.example.QuestX.Model.User;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.Repository.UserRepository;
import org.example.QuestX.dtos.UserDataDto;
import org.example.QuestX.exception.StatusInvalidException;
import org.example.QuestX.exception.UserNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;
    private final MailService mailService;

    public List<UserDataDto> getUserRequest() {
        List<User> user =  userRepository.findAllByStatus(Status.PENDING);
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

    }


}
