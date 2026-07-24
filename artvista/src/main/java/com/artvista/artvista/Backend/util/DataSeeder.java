package com.artvista.artvista.Backend.util;

import com.artvista.artvista.Backend.model.Artist;
import com.artvista.artvista.Backend.model.Event;
import com.artvista.artvista.Backend.model.Painting;
import com.artvista.artvista.Backend.repository.ArtistRepository;
import com.artvista.artvista.Backend.repository.EventRepository;
import com.artvista.artvista.Backend.repository.PaintingsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ArtistRepository artistRepository;
    private final PaintingsRepository paintingsRepository;
    private final EventRepository eventRepository;

    public DataSeeder(ArtistRepository artistRepository, PaintingsRepository paintingsRepository, EventRepository eventRepository) {
        this.artistRepository = artistRepository;
        this.paintingsRepository = paintingsRepository;
        this.eventRepository = eventRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Seeding dummy data...");

        String[] artistImages = {
            "/uploaded_images/artists/albert-dera-ILip77SbmOE-unsplash.jpg",
            "/uploaded_images/artists/ben-den-engelsen-YUu9UAcOKZ4-unsplash.jpg",
            "/uploaded_images/artists/cesar-rincon-XHVpWcr5grQ-unsplash.jpg",
            "/uploaded_images/artists/charlesdeluvio-kVg2DQTAK7c-unsplash.jpg",
            "/uploaded_images/artists/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign.jpg",
            "/uploaded_images/artists/christian-buehner-DItYlc26zVI-unsplash.jpg",
            "/uploaded_images/artists/christopher-campbell-rDEOVtE7vOs-unsplash.jpg",
            "/uploaded_images/artists/diego-hernandez-MSepzbKFz10-unsplash.jpg",
            "/uploaded_images/artists/jake-nackos-IF9TK5Uy-KI-unsplash.jpg",
            "/uploaded_images/artists/jurica-koletic-7YVZYZeITc8-unsplash.jpg",
            "/uploaded_images/artists/linkedin-sales-solutions-pAtA8xe_iVM-unsplash.jpg",
            "/uploaded_images/artists/michael-dam-mEZ3PoFGs_k-unsplash.jpg",
            "/uploaded_images/artists/stefan-stefancik-QXevDflbl8A-unsplash.jpg",
            "/uploaded_images/artists/vince-veras-AJIqZDAUD7A-unsplash.jpg",
            "/uploaded_images/artists/young-bearded-man-with-striped-shirt.jpg"
        };

        String[] paintingImages = {
            "/uploaded_images/paintings/adrianna-geo-1rBg5YSi00c-unsplash.jpg",
            "/uploaded_images/paintings/art-institute-of-chicago-AckZaYtIq3I-unsplash.jpg",
            "/uploaded_images/paintings/birmingham-museums-trust-4lDX-xTLl3Q-unsplash.jpg",
            "/uploaded_images/paintings/birmingham-museums-trust-8wcoY3wcbL0-unsplash.jpg",
            "/uploaded_images/paintings/birmingham-museums-trust-HEEvYhNzpEo-unsplash.jpg",
            "/uploaded_images/paintings/birmingham-museums-trust-wKlHsooRVbg-unsplash.jpg",
            "/uploaded_images/paintings/british-library-gUDNK8NqYHk-unsplash.jpg",
            "/uploaded_images/paintings/europeana-6c43FgRt0Dw-unsplash.jpg",
            "/uploaded_images/paintings/europeana-TjegK_z-0j8-unsplash.jpg",
            "/uploaded_images/paintings/europeana-VsnDYMWollM-unsplash.jpg",
            "/uploaded_images/paintings/europeana-YIfFVwDcgu8-unsplash.jpg",
            "/uploaded_images/paintings/henrik-donnestad-t2Sai-AqIpI-unsplash.jpg",
            "/uploaded_images/paintings/mcgill-library-y4PqRPqSako-unsplash.jpg",
            "/uploaded_images/paintings/steve-a-johnson-e5LdlAMpkEw-unsplash.jpg",
            "/uploaded_images/paintings/tamara-menzi-n-vnWQmmVoY-unsplash.jpg"
        };

        String[] eventImages = {
            "/uploaded_images/events/antenna-cw-cj_nFa14-unsplash.jpg",
            "/uploaded_images/events/britt-gaiser-hSAlu33padA-unsplash.jpg",
            "/uploaded_images/events/joe-planas-Yy2goJ6W54A-unsplash.jpg",
            "/uploaded_images/events/kai-oberhauser-_Zu-9injbWc-unsplash.jpg",
            "/uploaded_images/events/markus-spiske-RmvlD0oTsAo-unsplash.jpg",
            "/uploaded_images/events/rosalind-chang-BtXCR0QAzwU-unsplash.jpg",
            "/uploaded_images/events/serenay-gulsen-HlNGaRa2eXk-unsplash.jpg",
            "/uploaded_images/events/spencer-chow-bftMZBphNuA-unsplash.jpg",
            "/uploaded_images/events/spencer-chow-DDqocLNZ8J8-unsplash.jpg",
            "/uploaded_images/events/spencer-chow-Rew-1lxQO2Q-unsplash.jpg",
            "/uploaded_images/events/spencer-chow-ru-aCjqoOik-unsplash.jpg",
            "/uploaded_images/events/spencer-chow-rweSHJcY3iU-unsplash.jpg",
            "/uploaded_images/events/spencer-chow-T2f9cHqeqD0-unsplash.jpg",
            "/uploaded_images/events/spencer-chow-v4qqUMVXiJw-unsplash (1).jpg",
            "/uploaded_images/events/spencer-chow-v4qqUMVXiJw-unsplash.jpg"
        };

        List<Artist> artists = new ArrayList<>();
        String[] artistNames = {
            "Aarav Sharma", "Ishani Gupta", "Kabir Singh", "Ananya Verma", "Arjun Reddy",
            "Saanvi Iyer", "Vihaan Kapoor", "Zoya Khan", "Reyansh Malhotra", "Myra Joshi",
            "Aditya Das", "Kavya Nair", "Rohan Mehra", "Diya Saxena", "Vivaan Bose",
            "Shanaya Gill", "Aryan Chawla", "Kiara Sen", "Ishaan Roy", "Sara Ali",
            "Dev Patel", "Nora Fatehi", "Ranbir Kapoor", "Alia Bhatt", "Varun Dhawan"
        };

        for (int i = 0; i < 25; i++) {
            Artist artist = new Artist();
            artist.setName(artistNames[i]);
            artist.setBio("A renowned artist specializing in " + (i % 2 == 0 ? "contemporary" : "traditional") + " art forms. With over " + (5 + i) + " years of experience, their work has been exhibited globally.");
            artist.setProfileImage(artistImages[i % artistImages.length]);
            artists.add(artistRepository.save(artist));
        }

        Random random = new Random();
        String[] paintingTitles = {
            "Sunset at Ganges", "The Royal Bengal", "Ethereal Dreams", "Urban Chaos", "Silent Valley",
            "Golden Petals", "Whispering Woods", "Oceanic Bliss", "The Ancient Temple", "Colors of Life",
            "Morning Mist", "Dancing Peacocks", "Monsoon Magic", "The Lost City", "Celestial Light",
            "Nature's Symphony", "The Village Square", "Rhythm of Rajasthan", "Himalayan Peak", "Abstract Emotions",
            "The Last Train", "Midnight Serenade", "Eternal Bond", "Shadows of Past", "Future Visions",
            "Spring Bloom", "The Old Library", "Starry Night Remixed", "Sands of Time", "Lush Landscapes",
            "Geometric Patterns", "Vintage Charm", "Mystic Mountains", "The Busy Market", "Peaceful Pond",
            "Wildfire", "Frozen Moment", "The Great Banyan", "Coastal Breeze", "Hidden Path",
            "Symphony in Blue", "Emerald Forest", "Crimson Tide", "Golden Hour", "Silver Lining",
            "Desert Mirage", "City Lights", "Serene Sanctuary", "The Artisan at Work", "Legacy of Art"
        };

        String[] mediums = {"Oil on Canvas", "Acrylic", "Watercolor", "Charcoal", "Digital Art"};
        String[] sizes = {"24x36", "18x24", "30x40", "12x12", "16x20"};

        for (int i = 0; i < 50; i++) {
            Painting painting = new Painting();
            painting.setTitle(paintingTitles[i]);
            painting.setDescription("A beautiful " + mediums[i % mediums.length] + " painting that captures the essence of its subject.");
            painting.setMedium(mediums[i % mediums.length]);
            painting.setSize(sizes[i % sizes.length]);
            painting.setYear(2020 + random.nextInt(7));
            painting.setPrice(BigDecimal.valueOf(5000 + random.nextInt(45001)));
            painting.setImageUrl(paintingImages[i % paintingImages.length]);
            painting.setAvailable(true);
            painting.setArtist(artists.get(random.nextInt(artists.size())));
            paintingsRepository.save(painting);
        }

        String[] eventTitles = {
            "Art Exhibition 2026", "Workshop: Oil Painting", "Sculpture Masterclass", "Digital Art Fest", "Traditional Art Gala",
            "The Artist's Journey", "Modernism Reimagined", "Canvas & Coffee", "Street Art Workshop", "Gallery Opening Night",
            "Portrait Painting 101", "Watercolor Wonderland", "Abstract Expressionism", "Pottery Workshop", "Charcoal Sketching",
            "Art for a Cause", "The Color Wheel", "Shadow & Light", "Ink & Quill", "Contemporary Creators",
            "Fusion Art Show", "Kids' Art Camp", "The Minimalist Way", "Vintage Art Revival", "Nature Sketching",
            "Art & Technology", "The Creative Spark", "Global Art Summit", "Artist in Residence", "Curator's Choice",
            "Public Art Project", "Mural Painting", "Photography & Art", "The Great Art Auction", "Open Studio Day",
            "Art History Seminar", "Design Thinking", "Color Theory workshop", "Textile Art", "Mosaic Making",
            "Graffiti Fest", "The Zen of Doodling", "Mastering Light", "Palette Knife Magic", "Mixed Media Madness",
            "Art & Mindfulness", "The Visionary Artist", "Sculpting the Future", "Artistic Landscapes", "Grand Finale Art Show"
        };

        for (int i = 0; i < 50; i++) {
            Event event = new Event();
            event.setTitle(eventTitles[i]);
            event.setDescription("Join us for this exciting event hosted by ArtVista. An opportunity to learn and appreciate fine art.");
            event.setPrice(BigDecimal.valueOf(500 + random.nextInt(2001)));
            event.setLocation("ArtVista Gallery, Block " + (char)('A' + random.nextInt(5)));
            event.setDuration((1 + random.nextInt(4)) + " Hours");
            event.setEventDate(LocalDate.now().plusDays(random.nextInt(180)));
            event.setImageUrl(eventImages[i % eventImages.length]);
            event.setTotalSeats(20 + random.nextInt(31));
            event.setArtist(artists.get(random.nextInt(artists.size())));
            eventRepository.save(event);
        }

        updateExistingMockImages(artistImages, paintingImages, eventImages);

        System.out.println("Seeding completed successfully.");
    }

    private void updateExistingMockImages(String[] artistImages, String[] paintingImages, String[] eventImages) {
        List<Artist> existingArtists = artistRepository.findAll();
        for (int i = 0; i < existingArtists.size(); i++) {
            Artist artist = existingArtists.get(i);
            if (isMissingOrDefaultImage(artist.getProfileImage())) {
                artist.setProfileImage(artistImages[i % artistImages.length]);
                artistRepository.save(artist);
            }
        }

        List<Painting> existingPaintings = paintingsRepository.findAll();
        for (int i = 0; i < existingPaintings.size(); i++) {
            Painting painting = existingPaintings.get(i);
            if (isMissingOrDefaultImage(painting.getImageUrl())) {
                painting.setImageUrl(paintingImages[i % paintingImages.length]);
                paintingsRepository.save(painting);
            }
        }

        List<Event> existingEvents = eventRepository.findAll();
        for (int i = 0; i < existingEvents.size(); i++) {
            Event event = existingEvents.get(i);
            if (isMissingOrDefaultImage(event.getImageUrl())) {
                event.setImageUrl(eventImages[i % eventImages.length]);
                eventRepository.save(event);
            }
        }
    }

    private boolean isMissingOrDefaultImage(String imagePath) {
        if (imagePath == null || imagePath.isBlank() || imagePath.contains("default-") || !imagePath.startsWith("/uploaded_images/")) {
            return true;
        }
        String relativePath = imagePath.substring("/uploaded_images".length());
        java.io.File file = new java.io.File("uploaded_images" + relativePath);
        return !file.exists();
    }
}
