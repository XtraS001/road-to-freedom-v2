package com.example.backend.portfolio.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import com.example.backend.portfolio.PortfolioItem;
import com.example.backend.portfolio.dto.PortfolioItemDto;

@Mapper(componentModel = "spring", uses={PortfolioMapper.class})
public interface PortfolioItemMapper {

    @Mappings({
            @Mapping(target = "portfolio", source = "portfolioDto")
    })
    PortfolioItem toEntity(PortfolioItemDto portfolioItemDto);

    @Mappings({
            @Mapping(source = "portfolio", target = "portfolioDto")
    })
    PortfolioItemDto toDto(PortfolioItem portfolioItem);
}