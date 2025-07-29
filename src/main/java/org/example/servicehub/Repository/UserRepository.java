package org.example.servicehub.Repository;

import org.example.servicehub.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}