package com.artvista.artvista.Backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import com.artvista.artvista.Backend.model.Painting;

import java.util.List;

public interface PaintingsRepository extends JpaRepository<Painting, Long> {

    @Override
    @EntityGraph(attributePaths = {"artist"})
    Page<Painting> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"artist"})
    List<Painting> findByArtistId(Long artistId);
}
