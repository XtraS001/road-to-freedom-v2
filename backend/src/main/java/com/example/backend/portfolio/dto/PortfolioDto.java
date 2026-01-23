package com.example.backend.portfolio.dto;

import com.example.backend.users.data.UserDto;
import com.example.backend.util.Client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Client
public class PortfolioDto {
    private Long id;
    private String portfolioName;
    private Double realizedGain;
    private Double unrealizedGain;

    private UserDto userDto;
    // private List<PortfolioItemDto> itemsDto;
}