package com.example.backend.users.data;

import com.example.backend.util.Client;

import lombok.*;

//import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Client
public class UserDto {
    private Long id;
    private String email;

//    private List<TradeDto> tradeDtos;
//    private List<WatchlistDto> watchlistDtos;
//    private List<PortfolioDto> portfolioDtos;
}
