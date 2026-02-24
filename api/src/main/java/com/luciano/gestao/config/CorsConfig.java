package com.luciano.gestao.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {


@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();

    config.setAllowedOriginPatterns(List.of("*")); // 👈 qualquer origem
    config.setAllowedMethods(List.of("*"));        // qualquer método
    config.setAllowedHeaders(List.of("*"));        // qualquer header
    config.setExposedHeaders(List.of("Authorization"));
    config.setAllowCredentials(false);              // 👈 OBRIGATÓRIO

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return source;
}

}