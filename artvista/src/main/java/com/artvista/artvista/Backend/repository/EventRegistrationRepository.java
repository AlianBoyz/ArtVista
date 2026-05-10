package com.artvista.artvista.Backend.repository;

import com.artvista.artvista.Backend.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUserId(Long userId);

    List<EventRegistration> findByEventId(Long eventId);

    Optional<EventRegistration> findByUser_IdAndEvent_Id(Long userId, Long eventId);
}
