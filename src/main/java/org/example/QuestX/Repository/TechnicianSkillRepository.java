package org.example.QuestX.Repository;

import org.example.QuestX.Model.TechnicianSkill;
import org.example.QuestX.Model.TechnicianSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicianSkillRepository extends JpaRepository<TechnicianSkill, TechnicianSkillId> {
}