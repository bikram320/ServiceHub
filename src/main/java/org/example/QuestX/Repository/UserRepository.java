package org.example.QuestX.Repository;

import org.example.QuestX.Model.Status;
import org.example.QuestX.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    List<User> findAllByStatus(Status status);
}
