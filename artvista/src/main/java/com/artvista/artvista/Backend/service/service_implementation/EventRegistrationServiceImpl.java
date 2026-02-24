package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.exception.ResourceNotFoundException;
import com.artvista.artvista.Backend.model.Event;
import com.artvista.artvista.Backend.model.EventRegistration;
import com.artvista.artvista.Backend.model.User;
import com.artvista.artvista.Backend.repository.EventRegistrationRepository;
import com.artvista.artvista.Backend.repository.EventRepository;
import com.artvista.artvista.Backend.repository.UserRepository;
import com.artvista.artvista.Backend.service.EventRegistrationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventRegistrationServiceImpl implements EventRegistrationService {
    private final EventRegistrationRepository eventRegistrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public EventRegistrationServiceImpl(EventRegistrationRepository eventRegistrationRepository,
            UserRepository userRepository, EventRepository eventRepository) {
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    @Override
    public EventRegistration registerForEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        EventRegistration registration = new EventRegistration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus(EventRegistration.RegistrationStatus.ACCEPT);
        return eventRegistrationRepository.save(registration);
    }

    @Override
    public List<EventRegistration> getAllRegistrations() {
        return eventRegistrationRepository.findAll();
    }

    @Override
    public List<EventRegistration> getRegistrationsByUser(Long userId) {
        return eventRegistrationRepository.findByUserId(userId);
    }

    @Override
    public List<EventRegistration> getRegistrationsByEvent(Long eventId) {
        return eventRegistrationRepository.findByEventId(eventId);
    }

    @Override
    public EventRegistration getRegistrationById(Long registrationId) {
        return eventRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + registrationId));
    }

    @Override
    public EventRegistration updateRegistrationStatus(Long registrationId, EventRegistration.RegistrationStatus status) {
        EventRegistration registration = getRegistrationById(registrationId);
        registration.setStatus(status);
        return eventRegistrationRepository.save(registration);
    }
}
