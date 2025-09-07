package org.example.QuestX.Repository;

import org.example.QuestX.Model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    @Query("SELECT s FROM Skill s WHERE s.name = :name")
    Skill findByName(@Param("name") String name);
}