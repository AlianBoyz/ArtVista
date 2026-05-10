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
            "/uploaded_images/artists/1c10244a-1dd8-4e2e-a345-59a377350e21.png",
            "/uploaded_images/artists/1ca4b926-9302-4717-9311-075e0ab2c8fd.png",
            "/uploaded_images/artists/2853b96d-eb1e-48f7-8bc2-ded003f4e554.png",
            "/uploaded_images/artists/29e6f557-6318-4c4f-8bf9-f61c19df7c34.jpg",
            "/uploaded_images/artists/3abba6e4-1eb9-4f7d-942e-fd2d06d66cc0.png",
            "/uploaded_images/artists/3b1adef5-d217-4154-8e0e-9822788cbcdc.png",
            "/uploaded_images/artists/42b04799-8dc0-4c70-aea9-55a69254f149.jpeg",
            "/uploaded_images/artists/5d5553cb-caf7-423c-9c3d-8b3266dbe58b.png",
            "/uploaded_images/artists/5e17622a-ce59-4a45-9fea-67327c6bdd4f.png",
            "/uploaded_images/artists/5f676113-4285-4b6a-9016-f90db12874c5.png",
            "/uploaded_images/artists/6a8f048e-b57b-4698-ba63-1e1c14e90ec5.jpeg",
            "/uploaded_images/artists/8daa13f5-de71-486a-a365-860d419b2828.jpeg",
            "/uploaded_images/artists/8e87f86c-c7d0-4eb3-81ee-febd4118d53e.png",
            "/uploaded_images/artists/a1b24a9e-2b0f-47e0-b508-3885f982791d.png",
            "/uploaded_images/artists/a9fe5892-9697-4b2f-9986-5de1da964fef.png",
            "/uploaded_images/artists/ab3a33f2-fd5a-46cd-9bc3-100d08a523a1.jpeg",
            "/uploaded_images/artists/c69cf8c5-277e-439c-848c-d2ec056460be.jpeg",
            "/uploaded_images/artists/c7a1acbb-005c-4a24-8b20-a8d66ac78dd3.jpeg",
            "/uploaded_images/artists/db9d085d-a61a-4136-89b7-79208f4c8cf5.png"
        };

        String[] paintingImages = {
            "/uploaded_images/paintings/173fd057-6aa7-460b-88ce-c508f72b486b.png",
            "/uploaded_images/paintings/2521aa20-8305-48c7-8da6-f499287ad8de.jpeg",
            "/uploaded_images/paintings/38d4db52-2717-4ce9-85e2-eb534acb0520.png",
            "/uploaded_images/paintings/59ed6b40-3b67-4415-9860-ac7886f6225d.png",
            "/uploaded_images/paintings/5a1a8df5-fd2f-4e44-b509-aeed8f7dfd23.png",
            "/uploaded_images/paintings/7f821792-9fa7-4ed3-88df-f105253be006.png",
            "/uploaded_images/paintings/828d297f-b8a6-4548-81cf-637f1d66b649.png",
            "/uploaded_images/paintings/957162f2-7ff6-42d5-b225-534b6294672f.jpeg",
            "/uploaded_images/paintings/b089454e-4d55-4674-aa0f-10c8dd371116.png",
            "/uploaded_images/paintings/c8663b6a-af1f-4117-aa87-dcb4d4487c23.png",
            "/uploaded_images/paintings/d4476f28-ecfd-442c-bf9a-845492c82873.png",
            "/uploaded_images/paintings/dec5ee1b-bd6f-472a-980a-dfa87fc81bd8.jpeg"
        };

        String[] eventImages = {
            "/uploaded_images/events/12ee21f0-bc7e-4bfa-b22a-64a367b2e5e8.png",
            "/uploaded_images/events/420685f1-343a-413a-8c18-94c0c2198824.png",
            "/uploaded_images/events/5bb542c1-ac03-4358-b9ad-030e5a9ca16c.png",
            "/uploaded_images/events/67ca4deb-eb0e-42a3-b718-51b7e0c97b0b.gif",
            "/uploaded_images/events/789add10-a495-42a6-985a-27094ba1b497.png",
            "/uploaded_images/events/9168a891-9837-4c57-bd9c-c6e882c7f43f.jpeg",
            "/uploaded_images/events/91a4ce6a-7ffc-4ad6-9f54-3ab13ff9dbab.jpeg",
            "/uploaded_images/events/aa326afd-1620-4d82-a1b1-1a14e6ce65b0.png",
            "/uploaded_images/events/b938f151-507f-4609-b47f-fa6d01431005.png",
            "/uploaded_images/events/bbdfe0a9-cc22-4537-91ea-9b786efe3141.png",
            "/uploaded_images/events/c403d201-ea33-42ee-85de-03957d2a8556.jpeg",
            "/uploaded_images/events/c6bacd49-755b-4a76-a07e-1e7c74ab6b9b.png",
            "/uploaded_images/events/eab81327-3aa2-4843-a3cd-adbbc08b5c71.jpeg"
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
        return imagePath == null
                || imagePath.isBlank()
                || imagePath.contains("default-")
                || !imagePath.startsWith("/uploaded_images/");
    }
}
