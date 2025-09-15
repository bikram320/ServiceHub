package org.example.QuestX.Repository;

import org.example.QuestX.Model.ServiceRequest;
import org.example.QuestX.Model.ServiceStatus;
import org.example.QuestX.Model.Technician;
import org.example.QuestX.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    boolean existsByTechnicianAndAppointmentTimeBetween(Technician technician, LocalDateTime appointmentTime, LocalDateTime localDateTime);

    List<ServiceRequest> findByUserAndStatusIn(User user, List<ServiceStatus> activeStatuses);

    ServiceRequest findByUserAndId(User user, Long id);

    boolean existsByUserAndAppointmentTimeBetween(User user, LocalDateTime appointmentTimeAfter, LocalDateTime appointmentTimeBefore);

    List<ServiceRequest> findByTechnicianAndStatusIn(Technician technician, Collection<ServiceStatus> statuses);
}

