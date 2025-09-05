package org.example.QuestX.dtos;

import jakarta.validation.Valid;
import lombok.Data;


@Data
public class LoginRequest {
    private String email;
    private String password ;

}
