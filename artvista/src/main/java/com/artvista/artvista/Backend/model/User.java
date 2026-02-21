package com.artvista.artvista.Backend.model;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false,unique = true, length = 100)
    private String email;

    @Column (nullable = false, length = 255 )
    private String password;

    @Column(name="crated_at", updatable = false)
    private LocalDateTime cratedAt=LocalDateTime.now();

   @OneToMany(mappedBy = "user")
   private List<Order> orders;

   @OneToOne(mappedBy= "user")
   private Cart cart;

    public User(){}
    
    public User(Long id, String name, String email, String password, LocalDateTime cratedAt, List<Order> orders,
            Cart cart) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.cratedAt = cratedAt;
        this.orders = orders;
        this.cart = cart;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public LocalDateTime getCratedAt() {
        return cratedAt;
    }
    public void setCratedAt(LocalDateTime cratedAt) {
        this.cratedAt = cratedAt;
    }
    public List<Order> getOrders() {
        return orders;
    }
    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
    public Cart getCart() {
        return cart;
    }
    public void setCart(Cart cart) {
        this.cart = cart;
    }
    
   
    
}
