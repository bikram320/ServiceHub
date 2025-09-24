package org.example.QuestX.Repository;

import org.example.QuestX.Model.Feedback;
import org.example.QuestX.Model.Technician;
import org.example.QuestX.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findAllByRequest_Technician_Id(Long id);

    Optional<Feedback> findByRequest_Id(long id);


    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.request.user = :user")
    Double getAverageRatingByUser(@Param("user") User user);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.request.technician.id = :technicianId")
    Double getAverageRatingByTechnicianId(@Param("technicianId") Long technicianId);

    @Query("SELECT f FROM Feedback f WHERE f.request.technician.id = :technicianId")
    List<Feedback> findAllByTechnician(Long technicianId);
}
