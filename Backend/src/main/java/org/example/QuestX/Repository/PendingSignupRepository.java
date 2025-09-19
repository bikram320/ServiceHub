package org.example.QuestX.Repository;

import org.example.QuestX.Model.PendingSignup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PendingSignupRepository extends JpaRepository<PendingSignup, Long> {
    Optional<PendingSignup> findByEmail(String email);
    boolean existsByEmail(String email);
    void deleteByEmail(String email);
}