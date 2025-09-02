package org.example.servicehub.Repository;

import org.example.servicehub.Model.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByUser_EmailAndOtp(String email, String otp);
}