package org.example.QuestX.Repository;

import org.example.QuestX.Model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findAllByRequest_Technician_Id(Long id);

    Optional<Feedback> findByRequest_Id(long id);
}