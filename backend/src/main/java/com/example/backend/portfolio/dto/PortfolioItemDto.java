package com.example.backend.portfolio.dto;

import com.example.backend.util.Client;

import lombok.AllArgsConstructor;
// import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Client
public class PortfolioItemDto {
    private Long id;
    private String stockSymbol;
    private Double averageCost;
    private Double currentQuote;
    private Double quantity;
    
    private PortfolioDto portfolioDto;
}
