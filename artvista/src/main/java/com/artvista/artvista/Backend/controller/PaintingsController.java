package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.model.Painting;
import com.artvista.artvista.Backend.service.PaintingService;
import com.artvista.artvista.Backend.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/paintings")
public class PaintingsController {
    private final PaintingService paintingService;

    public PaintingsController(PaintingService paintingService) {
        this.paintingService = paintingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Painting>> addPainting(@RequestBody Painting painting) {
        return ResponseEntity.ok(ApiResponse.success("Painting added successfully", paintingService.addPainting(painting)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Painting>>> getAllPaintings() {
        return ResponseEntity.ok(ApiResponse.success("Paintings fetched successfully", paintingService.getAllPaintings()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Painting>> getPaintingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Painting fetched successfully", paintingService.getPaintingById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Painting>> updatePainting(@PathVariable Long id, @RequestBody Painting painting) {
        return ResponseEntity.ok(ApiResponse.success("Painting updated successfully", paintingService.updatePainting(id, painting)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePainting(@PathVariable Long id) {
        paintingService.deletePainting(id);
        return ResponseEntity.ok(ApiResponse.success("Painting deleted successfully", null));
    }
}
