package org.example.servicehub.Repository;

import org.example.servicehub.Model.TechnicianSkill;
import org.example.servicehub.Model.TechnicianSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicianSkillRepository extends JpaRepository<TechnicianSkill, TechnicianSkillId> {
}