package com.example.backend.stock.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.example.backend.util.Client;

import jakarta.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Client
public class CreateStockRequest {
    private String symbol;
    private String name;
    private Double currentQuote;
    private String exchange;

    @NotNull(message = "watchlistId is required")
    private Long watchlistId;   // To associate with a watchlist
}



