package com.example.backend.trade;

import com.example.backend.entity.AbstractEntity;
import com.example.backend.users.User;
import com.example.backend.util.Client;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Client
public class Trade extends AbstractEntity{
    private String stockSymbol;
    private Double buyPrice;
    private Double sellPrice;
    private Long quantity; // New field for number of shares
    private LocalDateTime buyDate;
    private LocalDateTime sellDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            foreignKey = @ForeignKey(name = "trade_user_fk")
    )
    private User user;

    public Trade (String stockSymbol, Double buyPrice, Double sellPrice, Long quantity, LocalDateTime buyDate, LocalDateTime sellDate) {
        this.stockSymbol = stockSymbol;
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
        this.quantity = quantity;
        this.buyDate = buyDate;
        this.sellDate = sellDate;
    }
}
