package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.exception.ResourceNotFoundException;
import com.artvista.artvista.Backend.model.Cart;
import com.artvista.artvista.Backend.model.CartItem;
import com.artvista.artvista.Backend.model.Order;
import com.artvista.artvista.Backend.model.OrderItem;
import com.artvista.artvista.Backend.model.User;
import com.artvista.artvista.Backend.repository.CartItemRepository;
import com.artvista.artvista.Backend.repository.CartRepository;
import com.artvista.artvista.Backend.repository.OrderRepository;
import com.artvista.artvista.Backend.repository.UserRepository;
import com.artvista.artvista.Backend.service.OrderService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(OrderRepository orderRepository, CartRepository cartRepository,
            CartItemRepository cartItemRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Order placeOrder(Order order) {
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }
        return orderRepository.save(order);
    }

    @Override
    public Order checkoutFromCart(Long userId, Order.PaymentType paymentType, String paymentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setPaymentType(paymentType == null ? Order.PaymentType.COD : paymentType);
        order.setPaymentId(paymentId);
        order.setOrrderStatus(Order.OrderStatus.ACCEPT);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            if (cartItem.getItemType() != CartItem.ItemType.PAINTING || cartItem.getPainting() == null) {
                continue;
            }
            int qty = cartItem.getQuantity() == null || cartItem.getQuantity() <= 0 ? 1 : cartItem.getQuantity();
            BigDecimal linePrice = cartItem.getPainting().getPrice().multiply(BigDecimal.valueOf(qty));
            total = total.add(linePrice);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setItemType(OrderItem.ItemType.PAINTING);
            orderItem.setPainting(cartItem.getPainting());
            orderItem.setPrice(linePrice);
            orderItems.add(orderItem);
        }

        if (orderItems.isEmpty()) {
            throw new IllegalArgumentException("No painting items found in cart");
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);

        return saved;
    }

    @Override
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    @Override
    public List<Order> getOrdersByPaintingId(Long paintingId) {
        return orderRepository.findByItemsPaintingId(paintingId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setOrrderStatus(status);
        return orderRepository.save(order);
    }
}
