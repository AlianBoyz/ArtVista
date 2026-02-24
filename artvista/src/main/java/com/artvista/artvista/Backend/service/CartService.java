package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.Cart;
import com.artvista.artvista.Backend.model.CartItem;

public interface CartService {

    Cart getCartByUserId(Long userId);

    Cart saveCart(Cart cart);

    CartItem addPaintingToCart(Long userId, Long paintingId, Integer quantity);
}
