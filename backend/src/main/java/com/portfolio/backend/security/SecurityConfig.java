package com.portfolio.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desactivamos protección clásica porque usamos JWT
            .cors(cors -> cors.configure(http)) // Permitimos peticiones de React (CORS)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Dejamos que TODO el mundo pueda hacer peticiones GET (Ver proyectos, perfil, etc.)
                .requestMatchers(HttpMethod.GET, "/api/v1/**").permitAll()
                // Permitimos a cualquiera intentar iniciar sesión
                .requestMatchers("/api/v1/auth/login").permitAll()
                // CUALQUIER OTRA COSA (POST, DELETE, PUT) requiere el Token JWT
                .anyRequest().authenticated()
            );

        // Ponemos a nuestro guardia (JwtFilter) en la puerta de entrada
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}