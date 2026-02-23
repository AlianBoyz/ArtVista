package com.artvista.artvista.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artvista.artvista.Backend.model.Artist;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    
}