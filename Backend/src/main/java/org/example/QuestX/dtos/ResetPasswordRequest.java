package org.example.QuestX.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {

    @NotBlank(message = "email is required")
    @Email
    String email;

    @NotBlank(message = "resetToken is required")
    String resetToken;

    @NotBlank(message = "Password in required")
    @Size(min = 8 , max = 32 , message = "password must be between 8 to 32 characters")
    String password;
}
