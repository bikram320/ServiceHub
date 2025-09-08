package org.example.QuestX.Repository;

import org.example.QuestX.Model.ServiceRequest;
import org.example.QuestX.Model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    boolean existsByTechnicianAndAppointmentTimeBetween(Technician technician, LocalDateTime appointmentTime, LocalDateTime localDateTime);
}
