package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.model.CartItem;
import com.artvista.artvista.Backend.model.Cart;
import com.artvista.artvista.Backend.exception.ResourceNotFoundException;
import com.artvista.artvista.Backend.model.Painting;
import com.artvista.artvista.Backend.model.User;
import com.artvista.artvista.Backend.repository.CartItemRepository;
import com.artvista.artvista.Backend.repository.CartRepository;
import com.artvista.artvista.Backend.repository.PaintingsRepository;
import com.artvista.artvista.Backend.repository.UserRepository;
import com.artvista.artvista.Backend.service.CartService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final PaintingsRepository paintingsRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository,
            UserRepository userRepository, PaintingsRepository paintingsRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.paintingsRepository = paintingsRepository;
    }

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId));
    }

    @Override
    public Cart saveCart(Cart cart) {
        if (cart.getItems() != null) {
            List<CartItem> normalizedItems = new ArrayList<>();
            for (CartItem item : cart.getItems()) {
                if (item == null) {
                    continue;
                }
                if (item.getItemType() != CartItem.ItemType.PAINTING || item.getPainting() == null) {
                    throw new IllegalArgumentException("Only paintings can be added to cart");
                }
                if (item.getQuantity() == null || item.getQuantity() <= 0) {
                    item.setQuantity(1);
                }
                item.setCart(cart);
                normalizedItems.add(item);
            }
            cart.setItems(normalizedItems);
        }

        return cartRepository.save(cart);
    }

    @Override
    public CartItem addPaintingToCart(Long userId, Long paintingId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Painting painting = paintingsRepository.findById(paintingId)
                .orElseThrow(() -> new ResourceNotFoundException("Painting not found with id: " + paintingId));

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        CartItem existingItem = cartItemRepository.findByCartUserIdAndPaintingId(userId, paintingId);
        if (existingItem != null) {
            int qty = quantity == null || quantity <= 0 ? 1 : quantity;
            existingItem.setQuantity(existingItem.getQuantity() + qty);
            return cartItemRepository.save(existingItem);
        }

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setPainting(painting);
        item.setItemType(CartItem.ItemType.PAINTING);
        item.setQuantity(quantity == null || quantity <= 0 ? 1 : quantity);

        return cartItemRepository.save(item);
    }
}
