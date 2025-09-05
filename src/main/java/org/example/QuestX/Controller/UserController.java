package org.example.QuestX.Controller;

import lombok.AllArgsConstructor;
import org.example.QuestX.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
    
    private final UserRepository userRepository;

    public ResponseEntity<?> userProfileSetup(){
        return ResponseEntity.ok().build();
    }

}
