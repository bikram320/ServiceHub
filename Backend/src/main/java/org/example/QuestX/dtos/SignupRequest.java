package org.example.QuestX.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupRequest {

    @NotBlank(message = "name must be provided")
    private String name ;

    @NotBlank(message = "email must be provided")
    @Email
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 8 , max = 32 , message = "password must be between 8 to 32 characters ")
    private String password;

    @NotBlank(message = "password is required")
    @Size(min = 8 , max = 32 , message = "password must be between 8 to 32 characters ")
    private String confirmPassword;
}
