package com.example.backend.stock;

import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;

import java.util.HashSet;
import java.util.Set;

import com.example.backend.entity.AbstractEntity;
import com.example.backend.util.Client;
import com.example.backend.watchlist.Watchlist;

// @Data    // This thing cause recursion stackoverflow
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Client
@Table(name = "stock", uniqueConstraints = @UniqueConstraint(name = "unique_symbol_name_exchange", columnNames = {
        "symbol", "name", "exchange" }))
@Entity
public class Stock extends AbstractEntity {
    private String symbol;
    private String name;
    private String exchange;
    private Double currentQuote;

    @JsonIgnore
    @ManyToMany(mappedBy = "stocks")
    private Set<Watchlist> watchlists = new HashSet<>(); // Use set because not repeatable

    public boolean isOrphan() {
        return watchlists.isEmpty();
    }

    public void addWatchlist(Watchlist watchlist) {
        this.watchlists.add(watchlist);
        watchlist.getStocks().add(this);
    }

    public Stock(String symbol, String name, String exchange, Double currentQuote) {
        this.symbol = symbol;
        this.name = name;
        this.exchange = exchange;
        this.currentQuote = currentQuote;
    }
}
