package com.example.backend.portfolio;

import com.example.backend.entity.AbstractEntity;
import com.example.backend.portfolio.dto.PortfolioItemDto;
import com.example.backend.util.Client;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Client
public class PortfolioItem extends AbstractEntity {

    private String stockSymbol;
    private Double averageCost;
    private Double currentQuote;
    private Double quantity;
    
    @ManyToOne
    private Portfolio portfolio;

    public PortfolioItem(PortfolioItemDto portfolioItem, Portfolio portfolio) {
        this.portfolio = portfolio;
        this.stockSymbol = portfolioItem.getStockSymbol();
        this.averageCost = portfolioItem.getAverageCost();
        this.currentQuote = portfolioItem.getCurrentQuote();
        this.quantity = portfolioItem.getQuantity();
    }
}
