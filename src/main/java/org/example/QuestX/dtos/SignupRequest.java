package org.example.QuestX.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupRequest {

    private String name ;
    private String email;
    private String password;
    private String confirmPassword;
}
