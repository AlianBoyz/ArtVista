package com.artvista.artvista.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artvista.artvista.Backend.model.Painting;

import java.util.List;

public interface PaintingsRepository extends JpaRepository<Painting, Long> {
    List<Painting> findByArtistId(Long artistId);
}
