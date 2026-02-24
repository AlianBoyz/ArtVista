package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.model.Artist;
import com.artvista.artvista.Backend.service.ArtistService;
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
@RequestMapping("/api/artists")
public class ArtistController {
    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Artist>> addArtist(@RequestBody Artist artist) {
        return ResponseEntity.ok(ApiResponse.success("Artist added successfully", artistService.addArtist(artist)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Artist>>> getAllArtists() {
        return ResponseEntity.ok(ApiResponse.success("Artists fetched successfully", artistService.getAllArtists()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Artist>> getArtistById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Artist fetched successfully", artistService.getArtistById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Artist>> updateArtist(@PathVariable Long id, @RequestBody Artist artist) {
        return ResponseEntity.ok(ApiResponse.success("Artist updated successfully", artistService.updateArtist(id, artist)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteArtist(@PathVariable Long id) {
        artistService.deleteArtist(id);
        return ResponseEntity.ok(ApiResponse.success("Artist deleted successfully", null));
    }
}
