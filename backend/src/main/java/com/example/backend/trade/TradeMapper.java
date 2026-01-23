package com.example.backend.trade;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import com.example.backend.trade.dto.BuyTradeRequest;
import com.example.backend.trade.dto.SellTradeRequest;
import com.example.backend.trade.dto.TradeDto;
import com.example.backend.trade.dto.TradeRequest;
import com.example.backend.users.mapper.UserMapper;



@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface TradeMapper {

    @Mappings({
            @Mapping(target = "user", source = "userDto")
    })
    Trade toEntity(TradeDto tradeDto);

    @Mappings({
            @Mapping(source = "user", target = "userDto")
    })
    TradeDto toDto(Trade trade);

        // NEW: TradeRequest -> Trade (ignores user)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true) // if AbstractEntity has an ID
    Trade toEntity(TradeRequest request);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true) // if AbstractEntity has an ID
    @Mapping(target = "sellPrice", ignore = true)
    @Mapping(target = "sellDate", ignore = true)
    Trade toEntity(BuyTradeRequest request);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true) // if AbstractEntity has an ID
    @Mapping(target = "buyPrice", ignore = true)
    @Mapping(target = "buyDate", ignore = true)
    Trade toEntity(SellTradeRequest request);
}
