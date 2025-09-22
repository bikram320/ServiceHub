package org.example.QuestX.dtos;

import lombok.Data;
import org.example.QuestX.Model.Status;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private String username;
    private String email;
    private String phone ;
    private String address;
    private String profileImagePath;
    private String documentPath;
    private Status status;
    private LocalDateTime verifiedAt;

}
