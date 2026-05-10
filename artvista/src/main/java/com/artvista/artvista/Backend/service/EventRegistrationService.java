package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.EventRegistration;

import java.util.List;

public interface EventRegistrationService {
    EventRegistration registerForEvent(Long userId, Long eventId, String paymentType, String paymentId);

    List<EventRegistration> getAllRegistrations();

    List<EventRegistration> getRegistrationsByUser(Long userId);

    List<EventRegistration> getRegistrationsByEvent(Long eventId);

    EventRegistration getRegistrationById(Long registrationId);

    EventRegistration updateRegistrationStatus(Long registrationId, EventRegistration.RegistrationStatus status);

    boolean isUserRegistered(Long userId, Long eventId);
}
