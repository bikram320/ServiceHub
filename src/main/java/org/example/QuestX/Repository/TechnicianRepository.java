package org.example.QuestX.Repository;

import org.example.QuestX.Model.Skill;
import org.example.QuestX.Model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    boolean existsByEmail(String email);
    Technician findByEmail(String email);

    @Query("SELECT ts.tech FROM TechnicianSkill ts WHERE ts.skill.id = :skillId")
    List<Technician> findTechniciansBySkillId(@Param("skillId") long skillId);}