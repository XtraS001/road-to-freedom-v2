package com.example.backend.watchlist;

import org.mapstruct.*;

import com.example.backend.users.mapper.UserMapper;
import com.example.backend.watchlist.dtos.WatchlistDto;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface WatchlistMapper {
        @Mappings({
            @Mapping(target = "user", source = "userDto")
            ,@Mapping(target = "stocks", ignore = true)
    })
    Watchlist toEntity(WatchlistDto watchlistDto);

    @Mappings({
            @Mapping(source = "user", target = "userDto")
            ,@Mapping(source = "stocks", target = "stockIds", ignore = true) //What is ignore?
    })
    WatchlistDto toDto(Watchlist watchlist);
}
