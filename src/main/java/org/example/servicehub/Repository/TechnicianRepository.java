package org.example.servicehub.Repository;

import org.example.servicehub.Model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicianRepository extends JpaRepository<Technician, Long> {
}