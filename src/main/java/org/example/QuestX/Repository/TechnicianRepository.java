package org.example.QuestX.Repository;

import org.example.QuestX.Model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    boolean existsByEmail(String email);
}