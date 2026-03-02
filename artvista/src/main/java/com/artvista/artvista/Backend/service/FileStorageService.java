package com.artvista.artvista.Backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeArtistImage(MultipartFile file);

    String storeEventImage(MultipartFile file);

    String storePaintingImage(MultipartFile file);
}
