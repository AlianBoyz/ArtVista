package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.Event;
import org.springframework.data.domain.Page;
import java.util.List;

public interface EventService {

    Event addEvent(Event event);

    Event updateEvent(Long id, Event event);

    List<Event> getAllEvents();

    Page<Event> getEventsPage(int page, int size);

    List<Event> getEventsByArtistId(Long artistId);

    Event getEventById(Long id);

    void deleteEvent(Long id);
}
