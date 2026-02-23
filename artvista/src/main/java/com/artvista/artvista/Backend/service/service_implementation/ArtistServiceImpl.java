package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.model.Artist;
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
    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    @Override
    public void deleteArtist(Long id) {
        artistRepository.deleteById(id);
    }
}