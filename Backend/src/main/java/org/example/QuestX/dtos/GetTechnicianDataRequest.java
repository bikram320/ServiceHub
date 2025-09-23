package org.example.QuestX.dtos;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class GetTechnicianDataRequest {
    long techId;
    String imageFile;
    String technicianName;
    String technicianEmail;
    String technicianAddress;
    String technicianPhone;
    String serviceName;
    String technicianBio;
    BigDecimal feeCharge;
}

