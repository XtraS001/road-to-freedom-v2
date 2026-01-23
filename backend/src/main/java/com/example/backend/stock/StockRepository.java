package com.example.backend.stock;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface StockRepository extends JpaRepository<Stock, Long> {
    Stock findBySymbol(String symbol);
    
    List<Stock> findBySymbolIn(List<String> symbols);

    // Set<Stock> findByWatchlistId(Long watchlistId);

    Stock findBySymbolAndNameAndExchange(String symbol, String name, String exchange);

    Set<Stock> findByWatchlists_Id(Long watchlistId);

    boolean existsBySymbolAndNameAndExchange(String symbol, String name, String exchange);
}
