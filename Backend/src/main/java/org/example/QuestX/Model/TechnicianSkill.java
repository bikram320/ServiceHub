package org.example.QuestX.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "technician_skills", schema = "servicehub")
public class TechnicianSkill {
    @EmbeddedId
    private TechnicianSkillId id;

    @MapsId("techId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "tech_id", nullable = false)
    private Technician technician;

    @MapsId("skillId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal feeCharged;

}