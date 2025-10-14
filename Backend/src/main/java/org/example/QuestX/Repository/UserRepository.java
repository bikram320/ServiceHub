package org.example.QuestX.Repository;

import org.example.QuestX.Model.Status;
import org.example.QuestX.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    List<User> findAllByStatus(Status status);

    // Changed to accept Status enum instead of String
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status")
    long countByStatus(@Param("status") Status status);

    @Query("SELECT u FROM User u WHERE u.createdAt >= :date ORDER BY u.createdAt DESC")
    List<User> findTop5ByCreatedAtAfterOrderByCreatedAtDesc(@Param("date") LocalDateTime date);
}