package com.artvista.artvista.Backend.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.WeakKeyException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret:your-secret-key-please-change-in-production}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    /**
     * Generate JWT token with user claims
     */
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    /**
     * Generate JWT token with custom claims
     */
    public String generateToken(String username, Map<String, Object> claims) {
        Map<String, Object> tokenClaims = new HashMap<>(claims);
        tokenClaims.put("username", username);
        return createToken(tokenClaims, username);
    }

    /**
     * Create JWT token
     */
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Get signing key
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        try {
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (WeakKeyException ex) {
            throw new IllegalStateException("JWT secret key is too weak. Use at least 64 bytes for HS512.", ex);
        }
    }

    /**
     * Validate JWT token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("Expired JWT token: " + e.getMessage());
        } catch (SignatureException e) {
            System.err.println("JWT signature validation failed: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("Unsupported JWT token: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }

    /**
     * Get username from token
     */
    public String getUsernameFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.getSubject();
    }

    /**
     * Get all claims from token
     */
    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Check if token is expired
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    /**
     * Get expiration date from token
     */
    public Date getExpirationDateFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.getExpiration();
    }
}
