package com.artvista.artvista.Backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Snapshot price at the time of purchase
    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ItemType itemType;

    //  Many OrderItems → One Order
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Many OrderItems → One Painting (optional)
    @ManyToOne
    @JoinColumn(name = "painting_id", nullable = true)
    private Painting painting;

    // Many OrderItems → One Event (optional)
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = true)
    private Event event;

     // Enum definition
    public enum ItemType {
        PAINTING,
        EVENT
    }

    // Default constructor (required by JPA)
    public OrderItem() {
    }

    public OrderItem(Long id, BigDecimal price, ItemType itemType, Order order, Painting painting, Event event) {
        this.id = id;
        this.price = price;
        this.itemType = itemType;
        this.order = order;
        this.painting = painting;
        this.event = event;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Painting getPainting() {
        return painting;
    }

    public void setPainting(Painting painting) {
        this.painting = painting;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    
}