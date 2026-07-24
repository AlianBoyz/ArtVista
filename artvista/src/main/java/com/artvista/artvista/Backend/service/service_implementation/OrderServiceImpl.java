package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.exception.ResourceNotFoundException;
import com.artvista.artvista.Backend.model.Cart;
import com.artvista.artvista.Backend.model.CartItem;
import com.artvista.artvista.Backend.model.Order;
import com.artvista.artvista.Backend.model.OrderItem;
import com.artvista.artvista.Backend.model.Painting;
import com.artvista.artvista.Backend.model.User;
import com.artvista.artvista.Backend.repository.CartItemRepository;
import com.artvista.artvista.Backend.repository.CartRepository;
import com.artvista.artvista.Backend.repository.OrderRepository;
import com.artvista.artvista.Backend.repository.UserRepository;
import com.artvista.artvista.Backend.service.OrderService;
import com.artvista.artvista.Backend.repository.PaintingsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    private final PaintingsRepository paintingsRepository;

    public OrderServiceImpl(OrderRepository orderRepository, CartRepository cartRepository,
            CartItemRepository cartItemRepository, UserRepository userRepository,
            PaintingsRepository paintingsRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.paintingsRepository = paintingsRepository;
    }

    @Override
    public Order placeOrder(Order order) {
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
                // Mark painting as sold if it's a painting
                if (item.getItemType() == OrderItem.ItemType.PAINTING && item.getPainting() != null) {
                    item.getPainting().setAvailable(false);
                    paintingsRepository.save(item.getPainting());
                }
            }
        }
        return orderRepository.save(order);
    }

    @Override
    public Order checkout(Long userId, Order.PaymentType paymentType, String paymentId, Long paintingId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Order order = new Order();
        order.setUser(user);
        order.setPaymentType(paymentType == null ? Order.PaymentType.COD : paymentType);
        order.setPaymentId(paymentId);
        order.setOrrderStatus(Order.OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        if (paintingId != null) {
            // "Buy Now" flow for a single painting
            Painting painting = paintingsRepository.findById(paintingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Painting not found with id: " + paintingId));

            if (!painting.getAvailable()) {
                throw new IllegalArgumentException("Painting is already sold");
            }

            total = painting.getPrice();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setItemType(OrderItem.ItemType.PAINTING);
            orderItem.setPainting(painting);
            orderItem.setPrice(total);
            orderItems.add(orderItem);

            // Mark as sold
            painting.setAvailable(false);
            paintingsRepository.save(painting);

        } else {
            // Regular cart checkout flow
            Cart cart = cartRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId));

            List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
            if (cartItems.isEmpty()) {
                throw new IllegalArgumentException("Cart is empty");
            }

            for (CartItem cartItem : cartItems) {
                if (cartItem.getItemType() != CartItem.ItemType.PAINTING || cartItem.getPainting() == null) {
                    continue;
                }
                
                if (!cartItem.getPainting().getAvailable()) {
                    continue; // Skip sold items
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

                // Mark as sold
                cartItem.getPainting().setAvailable(false);
                paintingsRepository.save(cartItem.getPainting());
            }

            if (orderItems.isEmpty()) {
                throw new IllegalArgumentException("No available painting items found in cart");
            }
            
            cartItemRepository.deleteAll(cartItems);
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        return orderRepository.save(order);
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
    public Page<Order> getOrdersPage(int page, int size) {
        return orderRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
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
