package org.example.servicehub.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "adminactions", schema = "servicehub")
public class Adminaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "action_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @Column(name = "action_type", nullable = false, length = 100)
    private String actionType;

    @Lob
    @Column(name = "target_type")
    private String targetType;

    @Column(name = "target_id")
    private Long targetId;

    @Lob
    @Column(name = "description")
    private String description;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

}