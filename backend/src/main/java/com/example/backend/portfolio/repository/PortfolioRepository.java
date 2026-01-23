package com.example.backend.portfolio.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.portfolio.Portfolio;
import com.example.backend.watchlist.Watchlist;

import java.util.List;
import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    // Portfolio findByUserId(Long userId);
    List<Portfolio> findByUserId(Long userId);
//    Optional<Portfolio> findByUserId(String userId);  
}
