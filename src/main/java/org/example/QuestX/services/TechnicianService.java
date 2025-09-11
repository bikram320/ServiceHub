package org.example.QuestX.services;

import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Technician;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.exception.TechnicianNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;

@AllArgsConstructor
@Service
public class TechnicianService {

    private  final TechnicianRepository technicianRepository;
    private final LocationService locationService;

    public void technicianProfileSetup(String email , String phone, String address, Double latitude,
                                       Double longitude, String bio, MultipartFile profileImage,
                                       MultipartFile identityDoc, MultipartFile validDoc) throws IOException {
        Technician technician = technicianRepository.findByEmail(email);
        if(technician == null){
            throw new TechnicianNotFoundException("Technician not found");
        }

        if(phone!=null){
            technician.setPhone(phone);
        }
        if (latitude != null && longitude != null) {
            technician.setLatitude(BigDecimal.valueOf(latitude));
            technician.setLongitude(BigDecimal.valueOf(longitude));

            if (address == null || address.isEmpty()) {
                address = locationService.getAddressByCoordinates(latitude, longitude);
            }
        }
        if(address!=null && !address.isEmpty()){
            technician.setAddress(address);
        }

        if(bio!=null && !bio.isEmpty()){
            technician.setBio(bio);
        }

        if (profileImage != null && !profileImage.isEmpty()) {

            String profilePath = "upload/technician/profile-image/" + profileImage.getOriginalFilename();
            File destFile = new File(System.getProperty("user.dir") + "/ServiceHub/" + profilePath);

            // Create directories if not exists
            destFile.getParentFile().mkdirs();
            // Save the file
            profileImage.transferTo(destFile);

            technician.setProfileImagePath(profilePath);
        }

        if (validDoc != null && !validDoc.isEmpty()) {
            String docPath = "upload/technician/documents/" + validDoc.getOriginalFilename();
            File destFile = new File(System.getProperty("user.dir") + "/ServiceHub/" + docPath);
            destFile.getParentFile().mkdirs();
            validDoc.transferTo(destFile);
            technician.setValidDocumentPath(docPath);
        }
        if (identityDoc != null && !identityDoc.isEmpty()) {
            String docPath = "upload/technician/identity-Proof/" + identityDoc.getOriginalFilename();
            File destFile = new File(System.getProperty("user.dir") + "/ServiceHub/" + docPath);
            destFile.getParentFile().mkdirs();
            identityDoc.transferTo(destFile);
            technician.setIdentityPath(docPath);
        }
        technicianRepository.save(technician);
    }
}
