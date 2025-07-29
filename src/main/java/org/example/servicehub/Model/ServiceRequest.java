package org.example.servicehub.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "servicerequests", schema = "servicehub")
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tech_id", nullable = false)
    private Technician tech;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "appointment_time", nullable = false)
    private Instant appointmentTime;

    @ColumnDefault("'PENDING'")
    @Lob
    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "fee_charged", nullable = false, precision = 10, scale = 2)
    private BigDecimal feeCharged;

    @Column(name = "rating")
    private Float rating;

    @Lob
    @Column(name = "feedback")
    private String feedback;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @OneToOne(mappedBy = "request")
    private Payment payment;

}