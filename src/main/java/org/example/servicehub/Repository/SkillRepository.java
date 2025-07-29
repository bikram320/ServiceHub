package org.example.servicehub.Repository;

import org.example.servicehub.Model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}