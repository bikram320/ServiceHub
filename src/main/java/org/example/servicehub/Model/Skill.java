package org.example.servicehub.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "skills", schema = "servicehub")
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @OneToMany(mappedBy = "skill")
    private Set<ServiceRequest> serviceRequests = new LinkedHashSet<>();

    @OneToMany(mappedBy = "skill")
    private Set<TechnicianSkill> technicianSkills = new LinkedHashSet<>();

}