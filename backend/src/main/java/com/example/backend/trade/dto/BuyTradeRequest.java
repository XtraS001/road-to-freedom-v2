package com.example.backend.trade.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.backend.stock.dto.StockDto;
import com.example.backend.util.Client;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Client
public class BuyTradeRequest {
    private String stockSymbol;
    private Double buyPrice;
    private Long quantity;
    private LocalDateTime buyDate;

    private StockDto stockDto;
}
