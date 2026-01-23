package com.example.backend.portfolio.service;

import com.example.backend.portfolio.mapper.PortfolioItemMapper;
import com.example.backend.portfolio.repository.PortfolioItemRepository;
import com.example.backend.portfolio.repository.PortfolioRepository;
import com.example.backend.stock.StockService;
import com.example.backend.stock.dto.CreateStockRequest;
import com.example.backend.stock.dto.StockDto;
import com.example.backend.util.exception.ResourceNotFoundException;
import com.example.backend.util.exception.UnauthorizedException;
import com.example.backend.watchlist.WatchlistService;
import com.example.backend.watchlist.dtos.WatchlistDto;

import jakarta.persistence.EntityNotFoundException;

import com.example.backend.portfolio.dto.PortfolioDto;
import com.example.backend.portfolio.dto.PortfolioItemDto;
import com.example.backend.auth.SecurityUtil;
import com.example.backend.portfolio.Portfolio;
import com.example.backend.portfolio.PortfolioItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PortfolioItemService {
    private final PortfolioItemRepository portfolioItemRepository;
    private final PortfolioRepository portfolioRepository;
    private final StockService stockService;
    private final WatchlistService watchlistService;
    @Autowired
    private PortfolioItemMapper portfolioItemMapper;

    public PortfolioItemService(
            PortfolioItemRepository portfolioItemRepository, PortfolioRepository portfolioRepository,
            StockService stockService,
            WatchlistService watchlistService
        ) {
        this.portfolioItemRepository = portfolioItemRepository;
        this.portfolioRepository = portfolioRepository;
        this.stockService = stockService;
        this.watchlistService = watchlistService;
    }

    // public PortfolioItemDto getPortfolioItem(PortfolioDto portfolioDto, String
    // stockSymbol) {

    // PortfolioItem portfolioItem = portfolioItemRepository
    // .findByPortfolioIdAndStockSymbol(portfolioDto.getId(), stockSymbol)
    // .orElseGet(() -> {
    // // PortfolioItem newItem = new PortfolioItem();
    // PortfolioItemDto newItemDto = new PortfolioItemDto();
    // newItemDto.setStockSymbol(stockSymbol);
    // newItemDto.setAverageCost(0.00);
    // newItemDto.setQuantity(0.00);
    // newItemDto.setPortfolioDto(portfolioDto);
    // PortfolioItem newItem = portfolioItemMapper.toEntity(newItemDto);

    // return portfolioItemRepository.save(newItem);
    // });

    // return portfolioItemMapper.toDto(portfolioItem);
    // }

    // Get 1 portfolio item
    public PortfolioItemDto getPortfolioItem(Long id) {

        Optional<PortfolioItem> item = portfolioItemRepository.findById(id);
        return item.map(portfolioItemMapper::toDto).orElse(null);
    }

    // Get portfolio items by portfolio id
    public List<PortfolioItemDto> getPortfolioItems(Long portfolioId) {

        List<PortfolioItem> items = portfolioItemRepository.findByPortfolioId(portfolioId);
        return items.stream()
                .map(portfolioItemMapper::toDto)
                .toList();
    }

    // Get portfolio item by stock symbol
    public PortfolioItemDto getPortfolioItemByStockSymbol(Long portfolioId, String stockSymbol) {
        List<PortfolioItem> items = portfolioItemRepository.findByPortfolioId(portfolioId);
        return items.stream()
                .filter(item -> item.getStockSymbol().equals(stockSymbol))
                .findFirst()
                .map(portfolioItemMapper::toDto)
                .orElse(null);
    }

    @Transactional
    public PortfolioItemDto createPortfolioItem(PortfolioItemDto itemDto) {
        Long portfolioId = itemDto.getPortfolioDto().getId();
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new EntityNotFoundException("Portfolio not found"));

        PortfolioItem newPortfolioItem = new PortfolioItem();
        newPortfolioItem.setStockSymbol(itemDto.getStockSymbol());
        newPortfolioItem.setAverageCost(itemDto.getAverageCost());
        newPortfolioItem.setCurrentQuote(itemDto.getCurrentQuote());
        newPortfolioItem.setQuantity(itemDto.getQuantity());
        newPortfolioItem.setPortfolio(portfolio);

        portfolio.addPortfolioItem(newPortfolioItem);

        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        PortfolioItemDto newPortfolioItemDto = portfolioItemMapper
                .toDto(updatedPortfolio.findItemByStockSymbol(itemDto.getStockSymbol()));

        // TODO update portfolio's unrealized gain

        return newPortfolioItemDto;
    }

    @Transactional
    public PortfolioItemDto updatePortfolioItem(PortfolioItemDto itemDto) {
        Long id = itemDto.getId();
        PortfolioItem item = portfolioItemRepository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("PortfolioItem is not exists with given id: " + id));

        // TODO check if user is the owner of the portfolioItem

        item.setAverageCost(itemDto.getAverageCost());
        item.setCurrentQuote(itemDto.getCurrentQuote());
        item.setQuantity(itemDto.getQuantity());

        PortfolioItem updatedPortfolioItem = portfolioItemRepository.save(item);

        // TODO update portfolio's unrealized gain

        return portfolioItemMapper.toDto(updatedPortfolioItem);
    }

    @Transactional
    public void deletePortfolioItemById(Long id) {

        // TODO check if user is the owner of the portfolioItem

        // TODO update portfolio's realized gain

        portfolioItemRepository.deleteById(id);
    }

    // Meant to be used in Creating Trade
    @Transactional
    public PortfolioItemDto getOrCreatePortfolioItem(
        // Long portfolioId, 
        StockDto stockDto, 
        PortfolioDto portfolioDto) {
        
        PortfolioItemDto itemDto = getPortfolioItemByStockSymbol(portfolioDto.getId(), stockDto.getSymbol());

        // Check if portfolio item exists
         if (itemDto == null) { // If not exist
            System.out.println("itemDto is null");

            // Add stock to watchlist
            Long watchlistId = watchlistService.getDefaultWatchlist().getId();
            // StockDto stockDto = stockService.searchStock(stockSymbol);

            CreateStockRequest stock= new CreateStockRequest(
                stockDto.getSymbol(),
                stockDto.getName(),
                stockDto.getCurrentQuote(),
                stockDto.getExchange(),
                watchlistId
            );
            stockService.createStock(stock);

            // Create new portfolio item
            itemDto = new PortfolioItemDto();
            itemDto.setAverageCost(0.0);
            itemDto.setQuantity(0.0);
            // itemDto.setStockSymbol(stockSymbol);
            itemDto.setStockSymbol(stockDto.getSymbol());
            itemDto.setPortfolioDto(portfolioDto);
            itemDto.setCurrentQuote(stockDto.getCurrentQuote());

            itemDto = createPortfolioItem(itemDto);
        }

        return itemDto;
    }
}
