package com.artvista.artvista.Backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "paintings")
public class Painting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 3000)
    private String description;

    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    private String medium;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String imageUrl;

    private Boolean available;

    private LocalDateTime createdAt;

    // Many Paintings → One Artist
    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @OneToMany(mappedBy = "painting")
    @JsonIgnore
    private List<CartItem> cartItems;

    // One Painting → Many OrderItems
    @OneToMany(mappedBy = "painting")
    @JsonIgnore
    private List<OrderItem> orderItems;

    // Default constructor (Required by JPA)
    public Painting() {
    }

    // Automatically set timestamp before saving
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.available == null) {
            this.available = true;
        }
    }

    public Painting(Long id, String title, String description, String size, String medium, Integer year,
            BigDecimal price, String imageUrl, Boolean available, LocalDateTime createdAt, Artist artist,
            List<CartItem> cartItems, List<OrderItem> orderItems) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.size = size;
        this.medium = medium;
        this.year = year;
        this.price = price;
        this.imageUrl = imageUrl;
        this.available = available;
        this.createdAt = createdAt;
        this.artist = artist;
        this.cartItems = cartItems;
        this.orderItems = orderItems;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getMedium() {
        return medium;
    }

    public void setMedium(String medium) {
        this.medium = medium;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Artist getArtist() {
        return artist;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

}
