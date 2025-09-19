package org.example.QuestX.Repository;

import org.example.QuestX.Model.PendingSignup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface PendingSignupRepository extends JpaRepository<PendingSignup, Long> {
    Optional<PendingSignup> findByEmail(String email);
    boolean existsByEmail(String email);

    @Modifying
    @Transactional  // Required if called outside a transactional service method
    @Query("DELETE FROM PendingSignup ps WHERE ps.email = :email")
    void deleteByEmail(@Param("email") String email);
}