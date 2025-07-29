package org.example.servicehub.Repository;

import org.example.servicehub.Model.Adminaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminActionRepository extends JpaRepository<Adminaction, Long> {
}