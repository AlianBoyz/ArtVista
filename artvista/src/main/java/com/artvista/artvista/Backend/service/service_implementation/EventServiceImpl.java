package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.model.Event;
import com.artvista.artvista.Backend.exception.ResourceNotFoundException;
import com.artvista.artvista.Backend.repository.EventRepository;
import com.artvista.artvista.Backend.service.EventService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public Event addEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Long id, Event event) {
        Event existing = getEventById(id);
        existing.setTitle(event.getTitle());
        existing.setDescription(event.getDescription());
        existing.setPrice(event.getPrice());
        existing.setLocation(event.getLocation());
        existing.setDuration(event.getDuration());
        existing.setEventDate(event.getEventDate());
        existing.setImageUrl(event.getImageUrl());
        existing.setArtist(event.getArtist());
        return eventRepository.save(existing);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    @Override
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }
}
