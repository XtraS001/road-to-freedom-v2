package com.example.backend.stock;

// import com.example.grok_stocks_api.entity.Watchlist;
import org.mapstruct.*;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.backend.stock.dto.StockDto;


@Mapper(componentModel = "spring")
public interface StockMapper {
    @Mapping(target = "watchlists", source ="watchlistIds", ignore = true)
    Stock toEntity(StockDto stockDTO);

    @Mapping(source = "watchlists", target = "watchlistIds", ignore = true)
    StockDto toDto(Stock stock);
}

