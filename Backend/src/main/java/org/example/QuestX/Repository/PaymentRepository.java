package org.example.QuestX.Repository;

import org.example.QuestX.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String pid);

    Payment findPaymentByTech_Email(String techEmail);
}
