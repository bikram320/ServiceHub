package org.example.servicehub.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "email_verification_tokens", schema = "servicehub")
public class EmailVerificationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id", nullable = false)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "email", nullable = false, referencedColumnName = "email")
    private User user;

    @Size(max = 6)
    @NotNull
    @Column(name = "OTP", nullable = false, length = 6)
    private String otp;

    @NotNull
    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private LocalDateTime createdAt;

}