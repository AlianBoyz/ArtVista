package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.Painting;
import java.util.List;

public interface PaintingService {

    Painting addPainting(Painting painting);

    List<Painting> getAllPaintings();

    Painting getPaintingById(Long id);

    void deletePainting(Long id);
}