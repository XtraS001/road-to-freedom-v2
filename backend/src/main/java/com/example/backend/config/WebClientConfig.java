package com.example.backend.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@ConditionalOnProperty(name = "webclient.enabled", havingValue = "true", matchIfMissing = false)
public class WebClientConfig {
    
    @Value("${yfinance.api.url}")
    private String baseUrl; // ✅ Injected from application-docker.properties
    
    @Bean
    public WebClient webClient() {
        // return WebClient.builder().baseUrl("http://localhost:8000").build();
        return WebClient.builder().baseUrl(baseUrl).build();
    }
}
