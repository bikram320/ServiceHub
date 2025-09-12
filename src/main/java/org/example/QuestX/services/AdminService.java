package org.example.QuestX.services;

import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Status;
import org.example.QuestX.Model.User;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.Repository.UserRepository;
import org.example.QuestX.dtos.UserDataDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;
    private final UserService userService;

    public List<UserDataDto> getUserRequest() {
        List<User> user =  userRepository.findAllByStatus(Status.PENDING);

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

}
