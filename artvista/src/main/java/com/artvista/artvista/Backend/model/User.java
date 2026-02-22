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

    @Column(name = "contact", nullable = false)
    private String phone;
 
    @Column(nullable = true)
    private String address;

    @Column(name = "pin_code",nullable = true)
    private Integer pinCode;

    @Column(nullable = true)
    private String city;

    @Column(name = "house_number",nullable = true)
    private String houseNumber;

    @Column(nullable = true)
    private String landmark;


    @Column(name="crated_at", updatable = false)
    private LocalDateTime cratedAt=LocalDateTime.now();

    @OneToMany(mappedBy = "user")
    private List<Order> orders;

    @OneToOne(mappedBy= "user")
    private Cart cart;

    public User(){}

    public User(Long id, String name, String email, String password, String phone, String address, Integer pinCode,
            String city, String houseNumber, String landmark, LocalDateTime cratedAt, List<Order> orders, Cart cart) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.pinCode = pinCode;
        this.city = city;
        this.houseNumber = houseNumber;
        this.landmark = landmark;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getPinCode() {
        return pinCode;
    }

    public void setPinCode(Integer pinCode) {
        this.pinCode = pinCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
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
