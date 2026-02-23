package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.Artist;
import java.util.List;

public interface ArtistService {

    Artist addArtist(Artist artist);

    List<Artist> getAllArtists();

    void deleteArtist(Long id);
}