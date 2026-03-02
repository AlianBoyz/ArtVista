package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.exception.ResourceNotFoundException;
import com.artvista.artvista.Backend.model.Artist;
import com.artvista.artvista.Backend.model.Painting;
import com.artvista.artvista.Backend.repository.ArtistRepository;
import com.artvista.artvista.Backend.service.FileStorageService;
import com.artvista.artvista.Backend.service.PaintingService;
import com.artvista.artvista.Backend.util.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/paintings")
public class PaintingsController {
    private final PaintingService paintingService;
    private final ArtistRepository artistRepository;
    private final FileStorageService fileStorageService;

    public PaintingsController(
            PaintingService paintingService,
            ArtistRepository artistRepository,
            FileStorageService fileStorageService) {
        this.paintingService = paintingService;
        this.artistRepository = artistRepository;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Painting>> addPainting(@RequestBody Painting painting) {
        return ResponseEntity.ok(ApiResponse.success("Painting added successfully", paintingService.addPainting(painting)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Painting>> addPaintingMultipart(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam String size,
            @RequestParam String medium,
            @RequestParam Integer year,
            @RequestParam BigDecimal price,
            @RequestParam(defaultValue = "true") Boolean available,
            @RequestParam Long artistId,
            @RequestParam("paintingImage") MultipartFile image) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + artistId));

        Painting painting = new Painting();
        painting.setTitle(title);
        painting.setDescription(description);
        painting.setSize(size);
        painting.setMedium(medium);
        painting.setYear(year);
        painting.setPrice(price);
        painting.setAvailable(available);
        painting.setArtist(artist);
        painting.setImageUrl(fileStorageService.storePaintingImage(image));

        return ResponseEntity.ok(ApiResponse.success("Painting added successfully", paintingService.addPainting(painting)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Painting>>> getAllPaintings() {
        return ResponseEntity.ok(ApiResponse.success("Paintings fetched successfully", paintingService.getAllPaintings()));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<ApiResponse<List<Painting>>> getPaintingsByArtistId(@PathVariable Long artistId) {
        return ResponseEntity.ok(ApiResponse.success("Artist paintings fetched successfully", paintingService.getPaintingsByArtistId(artistId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Painting>> getPaintingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Painting fetched successfully", paintingService.getPaintingById(id)));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Painting>> updatePainting(@PathVariable Long id, @RequestBody Painting painting) {
        return ResponseEntity.ok(ApiResponse.success("Painting updated successfully", paintingService.updatePainting(id, painting)));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Painting>> updatePaintingMultipart(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam String size,
            @RequestParam String medium,
            @RequestParam Integer year,
            @RequestParam BigDecimal price,
            @RequestParam(defaultValue = "true") Boolean available,
            @RequestParam(required = false) Long artistId,
            @RequestParam(value = "paintingImage", required = false) MultipartFile image) {
        Painting existing = paintingService.getPaintingById(id);
        existing.setTitle(title);
        existing.setDescription(description);
        existing.setSize(size);
        existing.setMedium(medium);
        existing.setYear(year);
        existing.setPrice(price);
        existing.setAvailable(available);

        if (artistId != null) {
            Artist artist = artistRepository.findById(artistId)
                    .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + artistId));
            existing.setArtist(artist);
        }

        if (image != null && !image.isEmpty()) {
            existing.setImageUrl(fileStorageService.storePaintingImage(image));
        }

        return ResponseEntity.ok(ApiResponse.success("Painting updated successfully", paintingService.updatePainting(id, existing)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePainting(@PathVariable Long id) {
        paintingService.deletePainting(id);
        return ResponseEntity.ok(ApiResponse.success("Painting deleted successfully", null));
    }
}
