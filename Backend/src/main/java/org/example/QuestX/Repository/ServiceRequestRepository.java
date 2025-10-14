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

    // Keep all existing methods...
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

    @Query("SELECT SUM(sr.feeCharged) FROM ServiceRequest sr WHERE sr.user = :user AND sr.status IN :statuses")
    BigDecimal getTotalAmountSpentByUserAndStatuses(User user, List<ServiceStatus> statuses);


    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.technician.id = :technicianId")
    long countByTechnicianId(@Param("technicianId") Long technicianId);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.technician.id = :technicianId AND sr.status IN :statuses")
    long countByTechnicianIdAndStatusIn(@Param("technicianId") Long technicianId, @Param("statuses") List<ServiceStatus> statuses);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.technician.id = :technicianId AND sr.status = :status")
    long countByTechnicianIdAndStatus(@Param("technicianId") Long technicianId, @Param("status") ServiceStatus status);

    @Query("SELECT SUM(sr.feeCharged) FROM ServiceRequest sr WHERE sr.technician.id = :technicianId AND sr.status = :status")
    Double sumFeeChargeByTechnicianIdAndStatus(@Param("technicianId") Long technicianId, @Param("status") ServiceStatus status);

    List<ServiceRequest> findByTechnicianIdAndUpdatedAtIsNotNull(Long technicianId);

    // Changed to accept ServiceStatus enum
    @Query("SELECT SUM(sr.feeCharged) FROM ServiceRequest sr WHERE sr.status = :status AND sr.updatedAt >= :date")
    Double sumFeeChargeByStatusAndDateAfter(@Param("status") ServiceStatus status, @Param("date") LocalDateTime date);

    @Query("SELECT AVG(f.rating) FROM Feedback f JOIN f.request sr WHERE sr.status = :status AND f.rating IS NOT NULL")
    Double averageRatingByStatus(@Param("status") ServiceStatus status);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.status IN :statuses")
    long countByStatusIn(@Param("statuses") List<ServiceStatus> statuses);

    @Query("SELECT sr FROM ServiceRequest sr WHERE sr.status = :status ORDER BY sr.updatedAt DESC")
    List<ServiceRequest> findTop5ByStatusOrderByUpdatedAtDesc(@Param("status") ServiceStatus status);

    @Query("SELECT SUM(sr.feeCharged) FROM ServiceRequest sr WHERE sr.status = :status AND sr.createdAt >= :start AND sr.createdAt < :end")
    Double sumFeeChargeByStatusAndDateBetween(@Param("status") ServiceStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.createdAt >= :date")
    long countByCreatedAtAfter(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.status = :status AND sr.createdAt >= :date")
    long countByStatusAndCreatedAtAfter(@Param("status") ServiceStatus status, @Param("date") LocalDateTime date);

    @Query("SELECT AVG(f.rating) FROM Feedback f JOIN f.request sr WHERE sr.status = :status AND f.rating IS NOT NULL AND sr.createdAt >= :date")
    Double averageRatingByStatusAndDateAfter(@Param("status") ServiceStatus status, @Param("date") LocalDateTime date);

    @Query("SELECT COUNT(DISTINCT sr.user.email) FROM ServiceRequest sr WHERE sr.createdAt >= :date")
    long countDistinctUsersByCreatedAtAfter(@Param("date") LocalDateTime date);
}
