package com.example.backend.portfolio.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import com.example.backend.portfolio.Portfolio;
import com.example.backend.portfolio.dto.PortfolioDto;
import com.example.backend.users.mapper.UserMapper;



// @Mapper(componentModel = "spring", uses = {UserMapper.class})
// public interface PortfolioMapper {

//     @Mappings({
//             @Mapping(target = "user", source = "userDto")
//     })
//     Portfolio toEntity(PortfolioDto portfolioDto);

//     @Mappings({
//             @Mapping(source = "user", target = "userDto")
//     })
//     PortfolioDto toDto(Portfolio portfolio);

// }

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface PortfolioMapper {

    @Mappings({
            @Mapping(target = "user", source = "userDto")
    })
    Portfolio toEntity(PortfolioDto portfolioDto);

    @Mappings({
            @Mapping(source = "user", target = "userDto")
    })
    PortfolioDto toDto(Portfolio portfolio);
}
