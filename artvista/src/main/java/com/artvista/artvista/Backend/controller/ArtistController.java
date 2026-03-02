package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.model.Artist;
import com.artvista.artvista.Backend.service.FileStorageService;
import com.artvista.artvista.Backend.service.ArtistService;
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

import java.util.List;

@RestController
@RequestMapping("/api/artists")
public class ArtistController {
    private final ArtistService artistService;
    private final FileStorageService fileStorageService;

    public ArtistController(ArtistService artistService, FileStorageService fileStorageService) {
        this.artistService = artistService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Artist>> addArtist(@RequestBody Artist artist) {
        return ResponseEntity.ok(ApiResponse.success("Artist added successfully", artistService.addArtist(artist)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Artist>> addArtistMultipart(
            @RequestParam String name,
            @RequestParam(required = false) String bio,
            @RequestParam("profileImage") MultipartFile image) {
        Artist artist = new Artist();
        artist.setName(name);
        artist.setBio(bio);
        artist.setProfileImage(fileStorageService.storeArtistImage(image));
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

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Artist>> updateArtist(@PathVariable Long id, @RequestBody Artist artist) {
        return ResponseEntity.ok(ApiResponse.success("Artist updated successfully", artistService.updateArtist(id, artist)));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Artist>> updateArtistMultipart(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String bio,
            @RequestParam(value = "profileImage", required = false) MultipartFile image) {
        Artist existing = artistService.getArtistById(id);
        existing.setName(name);
        existing.setBio(bio);
        if (image != null && !image.isEmpty()) {
            existing.setProfileImage(fileStorageService.storeArtistImage(image));
        }
        return ResponseEntity.ok(ApiResponse.success("Artist updated successfully", artistService.updateArtist(id, existing)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteArtist(@PathVariable Long id) {
        artistService.deleteArtist(id);
        return ResponseEntity.ok(ApiResponse.success("Artist deleted successfully", null));
    }
}
