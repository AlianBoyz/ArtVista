package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif");

    private final Path uploadRoot;

    public FileStorageServiceImpl(@Value("${app.upload.base-dir:uploaded_images}") String uploadBaseDir) {
        this.uploadRoot = Paths.get(uploadBaseDir).toAbsolutePath().normalize();
    }

    @Override
    public String storeArtistImage(MultipartFile file) {
        return store(file, "artists");
    }

    @Override
    public String storeEventImage(MultipartFile file) {
        return store(file, "events");
    }

    @Override
    public String storePaintingImage(MultipartFile file) {
        return store(file, "paintings");
    }

    private String store(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        String extension = resolveAndValidateExtension(file.getOriginalFilename());
        try {
            Path destinationDir = uploadRoot.resolve(folder).normalize();
            Files.createDirectories(destinationDir);

            String filename = UUID.randomUUID() + "." + extension;
            Path destinationFile = destinationDir.resolve(filename);
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            return "/uploaded_images/" + folder + "/" + filename;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store image file", ex);
        }
    }

    private String resolveAndValidateExtension(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank() || !originalFilename.contains(".")) {
            throw new IllegalArgumentException("Invalid image filename");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1)
                .toLowerCase(Locale.ROOT);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Only jpg, jpeg, png, webp, gif files are allowed");
        }
        return extension;
    }
}
