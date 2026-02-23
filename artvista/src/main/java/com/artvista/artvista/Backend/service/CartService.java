package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.Cart;

public interface CartService {

    Cart getCartByUserId(Long userId);

    Cart saveCart(Cart cart);
}