package org.example.QuestX.dtos;

import lombok.Data;
import org.example.QuestX.Model.Status;

import java.time.LocalDateTime;

@Data
public class TechnicianDataDto {
    private String name;
    private String email;
    private String phone ;
    private String address;
    private Status status;
    private String serviceCategory;
    private Boolean isEmailVerified;
    private String profileImagePath;
    private String documentPath;
    private String identityPath;
    private LocalDateTime createdAt;
}
