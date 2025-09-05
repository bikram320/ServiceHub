package org.example.QuestX.Controller.auth;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Admin;
import org.example.QuestX.Repository.AdminRepository;
import org.example.QuestX.dtos.JwtResponse;
import org.example.QuestX.dtos.LoginRequest;
import org.example.QuestX.services.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class AdminAuthController {

    private final  AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final JwtService jwtService;

    @PostMapping("/login/admin")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request,
                                        HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        Admin admin = adminRepository.findByEmail(request.getEmail());

        JwtResponse jwtResponse = jwtService.generateAndSetCookie(admin, response);
        return ResponseEntity.ok(jwtResponse);
    }


}
