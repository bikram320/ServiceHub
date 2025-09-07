package org.example.QuestX.services;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.QuestX.Model.Skill;
import org.example.QuestX.Model.User;
import org.example.QuestX.Repository.SkillRepository;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.Repository.UserRepository;
import org.example.QuestX.dtos.GetTechnicianDataRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@Service
public class UserService {


    private final UserRepository userRepository;
    private final LocationService locationService;
    private final TechnicianRepository technicianRepository;
    private final SkillRepository skillRepository;


    // Update profile service
    public void UpdateProfileSetup(
            String email ,String phone , String address,
            Double latitude, Double longitude,
            MultipartFile profileImage , MultipartFile validDoc
    ) throws IOException {

        User user = userRepository.findByEmail(email).orElseThrow((
                () -> new RuntimeException("User Not Found")
                ));
        if(phone!=null){
            user.setPhone(phone);
        }
        if (latitude != null && longitude != null) {
            user.setLatitude(BigDecimal.valueOf(latitude));
            user.setLongitude(BigDecimal.valueOf(longitude));

            if (address == null || address.isEmpty()) {
                address = locationService.getAddressByCoordinates(latitude, longitude);
            }
        }
        if(address!=null && !address.isEmpty()){
            user.setAddress(address);
        }

        if (profileImage != null && !profileImage.isEmpty()) {

            String profilePath = "upload/users/profile-image/" + profileImage.getOriginalFilename();
            File destFile = new File(System.getProperty("user.dir") + "/ServiceHub/" + profilePath);

            // Create directories if not exists
            destFile.getParentFile().mkdirs();
            // Save the file
            profileImage.transferTo(destFile);

            user.setProfileImagePath(profilePath);
        }

        if (validDoc != null && !validDoc.isEmpty()) {
            String docPath = "upload/users/documents/" + validDoc.getOriginalFilename();
            File destFile = new File(System.getProperty("user.dir") + "/ServiceHub/" + docPath);
            destFile.getParentFile().mkdirs();
            validDoc.transferTo(destFile);
            user.setDocumentPath(docPath);
        }
        userRepository.save(user);
    }

    public List<GetTechnicianDataRequest> getTechnicianBasedOnSkill(String skill){
        Skill skillEntity = skillRepository.findByName(skill);
        var technicians = technicianRepository.findTechniciansBySkillId(skillEntity.getId());

        return technicians.stream()
                .map(tech -> {
                    GetTechnicianDataRequest dto = new GetTechnicianDataRequest();
                    dto.setTechnicianName(tech.getName());
                    dto.setTechnicianAddress(tech.getAddress());
                    dto.setTechnicianPhone(tech.getPhone());
                    dto.setTechnicianBio(tech.getBio());
                    return dto;
                })
                .toList();

    }

}
