package org.example.QuestX.Repository;

import org.example.QuestX.Model.Status;
import org.example.QuestX.Model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    boolean existsByEmail(String email);
    Technician findByEmail(String email);

    @Query("SELECT t FROM Technician t " +
            "JOIN t.technicianSkills ts " +
            "WHERE ts.skill.id = :skillId AND t.available = true")
    List<Technician> findAvailableTechniciansBySkill(@Param("skillId") Long skillId);

    Technician findByEmailAndAvailable(String email, Boolean available);

    List<Technician> findAllByStatus(Status status);

    // Changed to accept Status enum
    @Query("SELECT COUNT(t) FROM Technician t WHERE t.status = :status")
    long countByStatus(@Param("status") Status status);

    @Query("SELECT t FROM Technician t WHERE t.status = :status ORDER BY t.createdAt DESC")
    List<Technician> findTop3ByStatusOrderByCreatedAtDesc(@Param("status") Status status);
}