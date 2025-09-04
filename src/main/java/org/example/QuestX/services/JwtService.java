package org.example.QuestX.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.JwtUser;
import org.example.QuestX.config.JwtConfig;
import org.example.QuestX.dtos.JwtResponse;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@AllArgsConstructor
public class JwtService {

    private final JwtConfig jwtConfig;

    public JwtResponse generateAndSetCookie(JwtUser jwtUser , HttpServletResponse response){
        var accessToken =generateAccessToken(jwtUser);
        var refreshToken =generateRefreshToken(jwtUser);

        var cookie = new Cookie("Refresh", refreshToken.toString());
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(jwtConfig.getRefreshTokenExpiration());
        response.addCookie(cookie);

        return  new JwtResponse(accessToken.toString());
    }

    public Jwt generateAccessToken(JwtUser jwtUser) {

        return generateToken(jwtUser, jwtConfig.getAccessTokenExpiration());
    }
    public Jwt generateRefreshToken(JwtUser jwtUser) {
        return generateToken(jwtUser,jwtConfig.getRefreshTokenExpiration());
    }

    private Jwt generateToken(JwtUser jwtUser , long tokenExpiration) {

        var claims = Jwts.claims()
                .subject(jwtUser.getId().toString())
                .add("email", jwtUser.getEmail())
                .add("name", jwtUser.getName())
                .add("role", jwtUser.getRole())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * tokenExpiration))
                .build();

        return new Jwt(claims, jwtConfig.getSecretKey());
    }

    public Jwt parseToken(String token) {
        try {
            var claims = getClaims(token);
            return new Jwt(claims, jwtConfig.getSecretKey());
        }catch (JwtException e){
            return null;
        }
    }


    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

}
