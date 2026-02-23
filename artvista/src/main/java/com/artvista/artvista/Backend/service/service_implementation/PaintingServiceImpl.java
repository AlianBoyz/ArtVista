package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.model.Painting;
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
    public List<Painting> getAllPaintings() {
        return paintingRepository.findAll();
    }

    @Override
    public Painting getPaintingById(Long id) {
        return paintingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Painting not found"));
    }

    @Override
    public void deletePainting(Long id) {
        paintingRepository.deleteById(id);
    }
}