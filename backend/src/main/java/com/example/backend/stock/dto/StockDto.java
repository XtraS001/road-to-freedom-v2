package com.example.backend.stock.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

import com.example.backend.util.Client;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Client
public class StockDto {
    private Long id;
    private String symbol;
    private String name;
    private Double currentQuote;
    private String exchange;
    
    private Set<Long> watchlistIds; // Only watchlist IDs. Avoid recurvsion and stackoverflow
}
