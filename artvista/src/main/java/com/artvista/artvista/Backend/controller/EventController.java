package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.dto.RegisterEventRequest;
import com.artvista.artvista.Backend.exception.ResourceNotFoundException;
import com.artvista.artvista.Backend.model.Artist;
import com.artvista.artvista.Backend.model.Event;
import com.artvista.artvista.Backend.model.EventRegistration;
import com.artvista.artvista.Backend.repository.ArtistRepository;
import com.artvista.artvista.Backend.service.EventService;
import com.artvista.artvista.Backend.service.FileStorageService;
import com.artvista.artvista.Backend.service.EventRegistrationService;
import com.artvista.artvista.Backend.util.ApiResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    private final EventRegistrationService eventRegistrationService;
    private final ArtistRepository artistRepository;
    private final FileStorageService fileStorageService;

    public EventController(
            EventService eventService,
            EventRegistrationService eventRegistrationService,
            ArtistRepository artistRepository,
            FileStorageService fileStorageService) {
        this.eventService = eventService;
        this.eventRegistrationService = eventRegistrationService;
        this.artistRepository = artistRepository;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Event>> addEvent(@RequestBody Event event) {
        return ResponseEntity.ok(ApiResponse.success("Event added successfully", eventService.addEvent(event)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Event>> addEventMultipart(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String duration,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate eventDate,
            @RequestParam Long artistId,
            @RequestParam("eventImage") MultipartFile image) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + artistId));

        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setPrice(price);
        event.setLocation(location);
        event.setDuration(duration);
        event.setEventDate(eventDate);
        event.setArtist(artist);
        event.setImageUrl(fileStorageService.storeEventImage(image));

        return ResponseEntity.ok(ApiResponse.success("Event added successfully", eventService.addEvent(event)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Event>>> getAllEvents() {
        return ResponseEntity.ok(ApiResponse.success("Events fetched successfully", eventService.getAllEvents()));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<ApiResponse<List<Event>>> getEventsByArtistId(@PathVariable Long artistId) {
        return ResponseEntity.ok(ApiResponse.success("Artist events fetched successfully", eventService.getEventsByArtistId(artistId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Event fetched successfully", eventService.getEventById(id)));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Event>> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", eventService.updateEvent(id, event)));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Event>> updateEventMultipart(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String duration,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate eventDate,
            @RequestParam(required = false) Long artistId,
            @RequestParam(value = "eventImage", required = false) MultipartFile image) {
        Event existing = eventService.getEventById(id);
        existing.setTitle(title);
        existing.setDescription(description);
        existing.setPrice(price);
        existing.setLocation(location);
        existing.setDuration(duration);
        existing.setEventDate(eventDate);

        if (artistId != null) {
            Artist artist = artistRepository.findById(artistId)
                    .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + artistId));
            existing.setArtist(artist);
        }

        if (image != null && !image.isEmpty()) {
            existing.setImageUrl(fileStorageService.storeEventImage(image));
        }

        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", eventService.updateEvent(id, existing)));
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
