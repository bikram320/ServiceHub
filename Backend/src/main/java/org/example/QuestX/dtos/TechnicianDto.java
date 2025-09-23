package org.example.QuestX.dtos;

import lombok.Data;
import org.example.QuestX.Model.Status;

@Data
public class TechnicianDto {
    private String technicianName;
    private String email;
    private String phone ;
    private String address;
    private String profileImagePath;
    private Status status;
    private String documentPath;
    private String identityPath;
    private String serviceType;
    private Double feeCharged;
    private String bio;
}
