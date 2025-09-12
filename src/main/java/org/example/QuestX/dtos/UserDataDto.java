package org.example.QuestX.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDataDto {
    private String username;
    private String email;
    private String phone ;
    private String address;
    private Boolean isEmailVerified;
    private String profileImagePath;
    private String documentPath;
    private LocalDateTime createdAt;
}
