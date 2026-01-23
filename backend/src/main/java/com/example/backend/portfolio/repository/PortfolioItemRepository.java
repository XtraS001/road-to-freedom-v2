package com.example.backend.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.portfolio.PortfolioItem;

import java.util.List;
import java.util.Optional;

public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {
    Optional<PortfolioItem> findByPortfolioIdAndStockSymbol(Long portfolioId, String stockSymbol);

    List<PortfolioItem> findByPortfolioId(Long portfolioId);
}
