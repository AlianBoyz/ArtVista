package com.artvista.artvista.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artvista.artvista.Backend.model.Painting;

public interface PaintingsRepository extends JpaRepository<Painting, Long> {

    
}