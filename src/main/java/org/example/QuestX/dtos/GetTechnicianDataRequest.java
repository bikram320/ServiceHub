package org.example.QuestX.dtos;

import lombok.Data;

@Data
public class GetTechnicianDataRequest {
    String technicianName;
    String technicianAddress;
    String technicianPhone;
    String technicianBio;
}

