package com.artvista.artvista.Backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import com.artvista.artvista.Backend.model.Event;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Override
    @EntityGraph(attributePaths = {"artist"})
    Page<Event> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"artist"})
    List<Event> findByArtistId(Long artistId);
}
