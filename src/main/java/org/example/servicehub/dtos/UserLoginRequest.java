package org.example.servicehub.dtos;

import lombok.Data;

@Data
public class UserLoginRequest {

    private String email;
    private String password ;

}
