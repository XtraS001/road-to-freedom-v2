package com.example.backend.watchlist;

import java.util.HashSet;

import com.example.backend.entity.AbstractEntity;
import com.example.backend.stock.Stock;
import com.example.backend.users.User;
import com.example.backend.util.Client;

// import lombok.Data;
// import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

// @Data
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Client
// @Table(
// name = "watchlist",
// uniqueConstraints = {
// @UniqueConstraint(name = "uk_user_watchlist_name", columnNames = {"user_id",
// "name"})
// }
// )
public class Watchlist extends AbstractEntity {
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id"
    // ,foreignKey = @ForeignKey(name = "watchlist_user_fk")
    )
    private User user;

    @ManyToMany
    @JoinTable(name = "watchlist_stock", joinColumns = @JoinColumn(name = "watchlist_id"), inverseJoinColumns = @JoinColumn(name = "stock_id"))
    private Set<Stock> stocks = new HashSet<>(); // Use Set because not repeated

    public Watchlist(String name, User user) {
        this.name = name;
        this.user = user;
    }

    public Watchlist(String name) {
        this.name = name;
    }

    public void addStock(Stock stock) {
        this.stocks.add(stock);
        stock.getWatchlists().add(this);
    }

}
