package com.example.backend.portfolio;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import com.example.backend.entity.AbstractEntity;
import com.example.backend.users.User;
import com.example.backend.util.Client;

//@Data
//@Entity
//public class Portfolio {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    private User user;
//
//    private String stockSymbol;
//    private Double averageBuyPrice;
//    private Double currentPrice;  // Current market price of the stock
//    private Long volume;         // Number of shares held
//}

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Client
public class Portfolio extends AbstractEntity {

    private String portfolioName;

    private Double realizedGain;
    private Double unrealizedGain;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "portfolio_user_fk"))
    private User user;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL)
    private List<PortfolioItem> items;

    public Portfolio(String name, User user) {
        this.portfolioName = name;
        this.user = user;
    }

    public Portfolio(String name) {
        this.portfolioName = name;
        this.realizedGain = 0.00;
        this.unrealizedGain = 0.00;
    }

    public void addPortfolioItem(PortfolioItem newPortfolioItem) {
        items.add(newPortfolioItem);
    }

    public PortfolioItem findItemByStockSymbol(String symbol) {
    return items.stream()
            .filter(i -> i.getStockSymbol().equalsIgnoreCase(symbol))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Stock not found: " + symbol));
}

}
