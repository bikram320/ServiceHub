package org.example.QuestX.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "technicians", schema = "servicehub")
public class Technician implements JwtUser{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tech_id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone", nullable = false, length = 15)
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "latitude", precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 6)
    private BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "bio")
    private String Bio;

    @Column(name = "esewa_id")
    private String esewa_id;

    @ColumnDefault("0")
    @Column(name = "email_verified", nullable = false)
    private Boolean isEmailVerified = false;

    @ColumnDefault("0")
    @Column(name = "available", nullable = false)
    private Boolean available = false;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public String getRole() {
        return this.role.name();
    }

    @Column(name = "rating")
    private Float rating;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "profile_image_path")
    private String profileImagePath;

    @Column(name = "document_path")
    private String validDocumentPath;

    @Column(name = "identity_path")
    private String identityPath;

    @Column(name = "earned_amount")
    private BigDecimal earnedAmount;


    @OneToMany(mappedBy = "tech")
    private Set<Payment> payments = new LinkedHashSet<>();

    @OneToMany(mappedBy = "technician")
    private Set<ServiceRequest> serviceRequests = new LinkedHashSet<>();

    @OneToMany(mappedBy = "technician")
    private Set<TechnicianSkill> technicianSkills = new LinkedHashSet<>();

}