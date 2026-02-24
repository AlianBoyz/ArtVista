package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.dto.RegisterEventRequest;
import com.artvista.artvista.Backend.model.Event;
import com.artvista.artvista.Backend.model.EventRegistration;
import com.artvista.artvista.Backend.service.EventService;
import com.artvista.artvista.Backend.service.EventRegistrationService;
import com.artvista.artvista.Backend.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    private final EventRegistrationService eventRegistrationService;

    public EventController(EventService eventService, EventRegistrationService eventRegistrationService) {
        this.eventService = eventService;
        this.eventRegistrationService = eventRegistrationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Event>> addEvent(@RequestBody Event event) {
        return ResponseEntity.ok(ApiResponse.success("Event added successfully", eventService.addEvent(event)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Event>>> getAllEvents() {
        return ResponseEntity.ok(ApiResponse.success("Events fetched successfully", eventService.getAllEvents()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Event fetched successfully", eventService.getEventById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", eventService.updateEvent(id, event)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<EventRegistration>> registerEvent(@RequestBody RegisterEventRequest request) {
        EventRegistration registration = eventRegistrationService.registerForEvent(request.getUserId(), request.getEventId());
        return ResponseEntity.ok(ApiResponse.success("Event registered successfully", registration));
    }
}
