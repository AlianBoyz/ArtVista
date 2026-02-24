package com.artvista.artvista.Backend.config;

import com.artvista.artvista.Backend.repository.UserRepository;
import com.artvista.artvista.Backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestUri = request.getRequestURI();
        String method = request.getMethod();

        // Keep auth/admin login endpoints and non-API routes public.
        if (!requestUri.startsWith("/api/")
                || requestUri.startsWith("/api/auth/")
                || requestUri.equals("/api/admin/login")
                || isPublicCatalogReadRequest(requestUri, method)
                || "OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            writeUnauthorized(response, "Missing or invalid Authorization header");
            return;
        }

        String jwtToken = authHeader.substring(7);
        if (!jwtUtil.validateToken(jwtToken)) {
            writeUnauthorized(response, "Invalid or expired JWT token");
            return;
        }

        String userEmail = jwtUtil.getUsernameFromToken(jwtToken);
        if (userRepository.findByEmail(userEmail).isEmpty()) {
            writeUnauthorized(response, "User not found for token");
            return;
        }

        // Make authenticated user available to downstream handlers if needed.
        request.setAttribute("authenticatedEmail", userEmail);

        filterChain.doFilter(request, response);
    }

    private void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        String sanitized = message.replace("\"", "");
        response.getWriter().write("{\"success\":false,\"message\":\"" + sanitized + "\"}");
    }

    private boolean isPublicCatalogReadRequest(String requestUri, String method) {
        if (!"GET".equalsIgnoreCase(method)) {
            return false;
        }
        return requestUri.startsWith("/api/paintings")
                || requestUri.startsWith("/api/artists")
                || requestUri.startsWith("/api/events");
    }
}
