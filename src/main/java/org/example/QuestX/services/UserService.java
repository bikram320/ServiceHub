package org.example.QuestX.services;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.QuestX.Model.User;
import org.example.QuestX.Repository.UserRepository;
import org.example.QuestX.config.GoogleApiKeyConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@Service
public class UserService {


    private final GoogleApiKeyConfig googleApiKeyConfig;
    private final UserRepository userRepository;

    //it will return api key
    public String getApikey(){
        return googleApiKeyConfig.getKey();
    }

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
                address = getAddressByCoordinates(latitude, longitude);
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

    // it will return the address in human-readable form
    public String getAddressByCoordinates(double latitude, double longitude) {
        String apiKey = getApikey();
        String url = String.format(
                "https://maps.googleapis.com/maps/api/geocode/json?latlng=%s,%s&key=%s",
                latitude, longitude, apiKey
        );
        System.out.println("URL: " + url);

        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            System.out.println("Response: " + response);

            if (response != null && "OK".equals(response.get("status"))) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                if (!results.isEmpty()) {
                    return (String) results.get(0).get("formatted_address");
                }
            }
        } catch (Exception e) {
            return e.getMessage();
        }

        return null;
    }


}
