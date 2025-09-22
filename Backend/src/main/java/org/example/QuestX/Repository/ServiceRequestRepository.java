package org.example.QuestX.Repository;

import org.example.QuestX.Model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    boolean existsByTechnicianAndAppointmentTimeBetween(Technician technician, LocalDateTime appointmentTime, LocalDateTime localDateTime);

    List<ServiceRequest> findByUserAndStatusIn(User user, List<ServiceStatus> activeStatuses);

    ServiceRequest findByUserAndId(User user, Long id);

    boolean existsByUserAndAppointmentTimeBetween(User user, LocalDateTime appointmentTimeAfter, LocalDateTime appointmentTimeBefore);

    List<ServiceRequest> findByTechnicianAndStatusIn(Technician technician, Collection<ServiceStatus> statuses);

    List<ServiceRequest> getServiceRequestByTechnicianEmail(String technicianEmail);

    List<ServiceRequest> getServiceRequestByTechnicianEmailAndPayment_Status(String technicianEmail, PaymentStatus paymentStatus);

    ServiceRequest getServiceRequestByUserAndStatus(User user, ServiceStatus status);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.user = :user AND sr.status IN :statuses")
    Long countByUserAndStatuses(@Param("user") User user, @Param("statuses") List<ServiceStatus> statuses);


    @Query("SELECT SUM(sr.feeCharged) FROM ServiceRequest sr WHERE sr.user = :user AND sr.status = :status")
    BigDecimal getTotalAmountSpentByUserAndStatus(User user, ServiceStatus status);
}


