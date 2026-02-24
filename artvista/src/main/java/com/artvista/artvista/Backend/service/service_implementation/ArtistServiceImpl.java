package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.model.Artist;
import com.artvista.artvista.Backend.exception.ResourceNotFoundException;
import com.artvista.artvista.Backend.repository.ArtistRepository;
import com.artvista.artvista.Backend.service.ArtistService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;

    public ArtistServiceImpl(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    @Override
    public Artist addArtist(Artist artist) {
        return artistRepository.save(artist);
    }

    @Override
    public Artist updateArtist(Long id, Artist artist) {
        Artist existing = getArtistById(id);
        existing.setName(artist.getName());
        existing.setBio(artist.getBio());
        existing.setProfileImage(artist.getProfileImage());
        return artistRepository.save(existing);
    }

    @Override
    public Artist getArtistById(Long id) {
        return artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + id));
    }

    @Override
    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    @Override
    public void deleteArtist(Long id) {
        if (!artistRepository.existsById(id)) {
            throw new ResourceNotFoundException("Artist not found with id: " + id);
        }
        artistRepository.deleteById(id);
    }
}
