package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.Painting;
import org.springframework.data.domain.Page;
import java.util.List;

public interface PaintingService {

    Painting addPainting(Painting painting);

    Painting updatePainting(Long id, Painting painting);

    List<Painting> getAllPaintings();

    Page<Painting> getPaintingsPage(int page, int size);

    List<Painting> getPaintingsByArtistId(Long artistId);

    Painting getPaintingById(Long id);

    void deletePainting(Long id);
}
