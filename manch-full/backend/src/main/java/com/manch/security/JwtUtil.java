package com.manch.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
@Component @Slf4j
public class JwtUtil {
    @Value("${app.jwt.secret}") private String jwtSecret;
    @Value("${app.jwt.expiration-ms}") private long jwtExpirationMs;
    @Value("${app.jwt.refresh-expiration-ms}") private long refreshExpirationMs;
    private SecretKey getSigningKey() { return Keys.hmacShaKeyFor(jwtSecret.getBytes()); }
    public String generateToken(UserDetails ud) { return buildToken(new HashMap<>(), ud, jwtExpirationMs); }
    public String generateRefreshToken(UserDetails ud) { return buildToken(new HashMap<>(), ud, refreshExpirationMs); }
    private String buildToken(Map<String,Object> claims, UserDetails ud, long exp) {
        return Jwts.builder().claims(claims).subject(ud.getUsername()).issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis()+exp)).signWith(getSigningKey()).compact();
    }
    public String extractUsername(String token) { return extractClaim(token, Claims::getSubject); }
    public <T> T extractClaim(String token, Function<Claims,T> resolver) { return resolver.apply(extractAllClaims(token)); }
    public boolean isTokenValid(String token, UserDetails ud) {
        try { return extractUsername(token).equals(ud.getUsername()) && !extractClaim(token, Claims::getExpiration).before(new Date()); }
        catch (Exception e) { return false; }
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
    }
}
