package org.example.QuestX.dtos;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class GetTechnicianDataRequest {
    String technicianName;
    String technicianAddress;
    String technicianPhone;
    String technicianBio;
    BigDecimal feeCharge;
}

