package org.example.QuestX.Controller;

import lombok.AllArgsConstructor;
import org.example.QuestX.Repository.UserRepository;
import org.example.QuestX.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@AllArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/update-profile")
    public ResponseEntity<?> UpdateProfileSetup(
            @RequestParam String email,
            @RequestParam(required = false) String phone ,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) MultipartFile profile_image,
            @RequestParam(required = false) MultipartFile valid_doc
    ) throws IOException {
        userService.UpdateProfileSetup(email , phone, address, latitude, longitude, profile_image, valid_doc);
        return ResponseEntity.ok("Profile Updated Successfully");
    }

}
