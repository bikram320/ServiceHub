package org.example.QuestX.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users", schema = "servicehub")
public class User implements JwtUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "latitude", precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 6)
    private BigDecimal longitude;

    @ColumnDefault("0")
    @Column(name = "email_verified", nullable = false)
    private Boolean isEmailVerified = false;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public String getRole() {
        return this.role.name();
    }

    @Column(name = "profile_image_path")
    private String profileImagePath;

    @Column(name = "document_path")
    private String documentPath;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user")
    private Set<Payment> payments = new LinkedHashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<ServiceRequest> serviceRequests = new LinkedHashSet<>();

}