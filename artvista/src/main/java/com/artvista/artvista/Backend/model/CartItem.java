package com.artvista.artvista.Backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name= "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ItemType itemType;


    @ManyToOne
    @JoinColumn(name= "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "painting_id", nullable = true)
    private Painting painting;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = true)
    private Event event;

     public enum ItemType {
        PAINTING,
        EVENT
    }


    public CartItem(){}


    public CartItem(Long id, Integer quantity, ItemType itemType, Cart cart, Painting painting, Event event) {
        this.id = id;
        this.quantity = quantity;
        this.itemType = itemType;
        this.cart = cart;
        this.painting = painting;
        this.event = event;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public Integer getQuantity() {
        return quantity;
    }


    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public ItemType getItemType() {
        return itemType;
    }


    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }


    public Cart getCart() {
        return cart;
    }


    public void setCart(Cart cart) {
        this.cart = cart;
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
