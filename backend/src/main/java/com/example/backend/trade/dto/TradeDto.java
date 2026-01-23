package com.example.backend.trade.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.example.backend.users.data.UserDto;
import com.example.backend.util.Client;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Client
public class TradeDto {
    private Long id;
    private String stockSymbol;
    private Double buyPrice;
    private Double sellPrice;
    private Long quantity;
    private LocalDateTime buyDate;
    private LocalDateTime sellDate;
    private UserDto userDto;
}
