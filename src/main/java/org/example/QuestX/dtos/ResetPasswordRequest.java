package org.example.QuestX.dtos;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    String email;
    String resetToken;
    String password;
}
