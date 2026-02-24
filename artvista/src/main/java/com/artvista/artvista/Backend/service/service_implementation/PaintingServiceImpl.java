package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.model.Painting;
import com.artvista.artvista.Backend.exception.ResourceNotFoundException;
import com.artvista.artvista.Backend.repository.PaintingsRepository;
import com.artvista.artvista.Backend.service.PaintingService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaintingServiceImpl implements PaintingService {

    private final PaintingsRepository paintingRepository;

    public PaintingServiceImpl(PaintingsRepository paintingRepository) {
        this.paintingRepository = paintingRepository;
    }

    @Override
    public Painting addPainting(Painting painting) {
        return paintingRepository.save(painting);
    }

    @Override
    public Painting updatePainting(Long id, Painting painting) {
        Painting existing = getPaintingById(id);
        existing.setTitle(painting.getTitle());
        existing.setDescription(painting.getDescription());
        existing.setSize(painting.getSize());
        existing.setMedium(painting.getMedium());
        existing.setYear(painting.getYear());
        existing.setPrice(painting.getPrice());
        existing.setImageUrl(painting.getImageUrl());
        existing.setAvailable(painting.getAvailable());
        existing.setArtist(painting.getArtist());
        return paintingRepository.save(existing);
    }

    @Override
    public List<Painting> getAllPaintings() {
        return paintingRepository.findAll();
    }

    @Override
    public Painting getPaintingById(Long id) {
        return paintingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Painting not found with id: " + id));
    }

    @Override
    public void deletePainting(Long id) {
        if (!paintingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Painting not found with id: " + id);
        }
        paintingRepository.deleteById(id);
    }
}
