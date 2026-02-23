package com.artvista.artvista.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artvista.artvista.Backend.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

    
}