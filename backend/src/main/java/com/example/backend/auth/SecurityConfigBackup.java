package com.example.backend.auth;

public class SecurityConfigBackup {
    
}


// package com.example.backend.auth;

// import com.example.backend.config.ApplicationProperties;
// import lombok.RequiredArgsConstructor;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;

// import jakarta.servlet.http.HttpServletRequest;
// import java.util.List;

// @Configuration
// @EnableMethodSecurity
// @RequiredArgsConstructor
// public class SecurityConfiguration {

//     private final ApplicationProperties applicationProperties;

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         // Disable ALL security
//         http
//             .csrf(AbstractHttpConfigurer::disable)
//             .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//             .authorizeHttpRequests(auth -> auth
//                 .anyRequest().permitAll()
//             )
//             .headers(AbstractHttpConfigurer::disable)
//             .httpBasic(AbstractHttpConfigurer::disable)
//             .formLogin(AbstractHttpConfigurer::disable)
//             .logout(AbstractHttpConfigurer::disable)
//             .oauth2Login(AbstractHttpConfigurer::disable);

//         return http.build();
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     private CorsConfigurationSource corsConfigurationSource() {
//         return new CorsConfigurationSource() {
//             @Override
//             public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
//                 CorsConfiguration config = new CorsConfiguration();
//                 config.setAllowedOrigins(applicationProperties.getAllowedOrigins());
//                 config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//                 config.setAllowedHeaders(List.of("*"));
//                 config.setAllowCredentials(true);
//                 return config;
//             }
//         };
//     }

//     @Bean
//     public AuthenticationManager authenticationManager() throws Exception {
//         // Dummy AuthenticationManager for compatibility
//         return authentication -> authentication;
//     }
// }
