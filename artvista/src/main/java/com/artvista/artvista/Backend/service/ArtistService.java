package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.Artist;
import org.springframework.data.domain.Page;
import java.util.List;

public interface ArtistService {

    Artist addArtist(Artist artist);

    Artist updateArtist(Long id, Artist artist);

    Artist getArtistById(Long id);

    List<Artist> getAllArtists();

    Page<Artist> getArtistsPage(int page, int size);

    void deleteArtist(Long id);
}
