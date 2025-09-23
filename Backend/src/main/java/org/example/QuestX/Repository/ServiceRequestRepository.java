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


    boolean existsByTechnicianAndAppointmentTimeBetweenAndStatusNot(
            Technician technician,
            LocalDateTime start,
            LocalDateTime end,
            ServiceStatus status
    );

    boolean existsByUserAndAppointmentTimeBetweenAndStatusNot(
            User user,
            LocalDateTime start,
            LocalDateTime end,
            ServiceStatus status
    );
    List<ServiceRequest> findByUserAndStatusIn(User user, List<ServiceStatus> activeStatuses);

    ServiceRequest findByUserAndId(User user, Long id);

    List<ServiceRequest> findByTechnicianAndStatusIn(Technician technician, Collection<ServiceStatus> statuses);

    List<ServiceRequest> getServiceRequestByTechnicianEmailAndPayment_Status(String technicianEmail, PaymentStatus paymentStatus);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.user = :user AND sr.status IN :statuses")
    Long countByUserAndStatuses(@Param("user") User user, @Param("statuses") List<ServiceStatus> statuses);


    @Query("SELECT SUM(sr.feeCharged) FROM ServiceRequest sr WHERE sr.user = :user AND sr.status = :status")
    BigDecimal getTotalAmountSpentByUserAndStatus(User user, ServiceStatus status);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.technician.id = :technicianId")
    long countByTechnicianId(@Param("technicianId") Long technicianId);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.technician.id = :technicianId AND sr.status IN :statuses")
    long countByTechnicianIdAndStatusIn(@Param("technicianId") Long technicianId, @Param("statuses") List<ServiceStatus> statuses);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.technician.id = :technicianId AND sr.status = :status")
    long countByTechnicianIdAndStatus(@Param("technicianId") Long technicianId, @Param("status") ServiceStatus status);

    @Query("SELECT SUM(sr.feeCharged) FROM ServiceRequest sr WHERE sr.technician.id = :technicianId AND sr.status = :status")
    Double sumFeeChargeByTechnicianIdAndStatus(@Param("technicianId") Long technicianId, @Param("status") ServiceStatus status);

    List<ServiceRequest> findByTechnicianIdAndUpdatedAtIsNotNull(Long technicianId);
}





