package org.example.QuestX.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @PutMapping("/login")
    public ResponseEntity<?> adminLogin() {
        return new ResponseEntity<>("admin login", HttpStatus.OK);
    }

}
