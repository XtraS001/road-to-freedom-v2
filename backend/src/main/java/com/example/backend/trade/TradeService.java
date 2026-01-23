package com.example.backend.trade;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.auth.SecurityUtil;

import com.example.backend.portfolio.dto.PortfolioDto;
import com.example.backend.portfolio.dto.PortfolioItemDto;
import com.example.backend.trade.dto.BuyTradeRequest;
import com.example.backend.trade.dto.SellTradeRequest;
import com.example.backend.trade.dto.TradeDto;
import com.example.backend.trade.dto.TradeRequest;

import com.example.backend.portfolio.service.PortfolioItemService;
import com.example.backend.portfolio.service.PortfolioService;
import com.example.backend.stock.StockService;
import com.example.backend.watchlist.WatchlistService;

import com.example.backend.users.User;
import com.example.backend.users.data.UserDto;
import com.example.backend.users.mapper.UserMapper;
import com.example.backend.users.repository.UserRepository;
import com.example.backend.util.exception.ApiException;
import com.example.backend.util.exception.ResourceNotFoundException;
import com.example.backend.util.exception.UnauthorizedException;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class TradeService {
    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;

    private final PortfolioService portfolioService;
    private final PortfolioItemService portfolioItemService;
    private final WatchlistService watchlistService;
    private final StockService stockService;
    @Autowired
    private TradeMapper tradeMapper;
    @Autowired
    private UserMapper userMapper;

    public TradeService(
            TradeRepository tradeRepository,
            UserRepository userRepository,

            PortfolioService portfolioService,
            PortfolioItemService portfolioItemService,
            WatchlistService watchlistService,
            StockService stockService

    ) {
        this.tradeRepository = tradeRepository;
        this.userRepository = userRepository;

        this.portfolioService = portfolioService;
        this.portfolioItemService = portfolioItemService;
        this.watchlistService = watchlistService;
        this.stockService = stockService;
    }

    public List<Trade> getUserTrades() {
        User user = SecurityUtil.getAuthenticatedUser();
        return tradeRepository.findByUserId(user.getId());
    }

    // Dto version
    public List<TradeDto> getTrades() {
        User user = SecurityUtil.getAuthenticatedUser();
        List<Trade> trades = tradeRepository.findByUserId(user.getId());

        return trades.stream().map(
                tradeMapper::toDto).toList();
        // (trade) -> tradeMapper.toDto(trade)).toList();
    }

    // // temporary
    // @Transactional
    // public TradeDto createTrade(TradeDto tradeDto) {
    // User user =
    // userRepository.findById(SecurityUtil.getAuthenticatedUser().getId())
    // .orElseThrow(() -> new EntityNotFoundException("User not found"));

    // Trade trade = tradeMapper.toEntity(tradeDto);
    // trade.setUser(user);

    // user.addTrade(trade);

    // return tradeMapper.toDto(tradeRepository.save(trade)); // Different with
    // watchlistService method
    // }

    // update portfolio for every trade
    @Transactional
    // public TradeDto createTrade(TradeDto tradeDto) {
    public TradeDto createTrade(TradeRequest tradeDto) {
        User user = userRepository.findById(SecurityUtil.getAuthenticatedUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Trade trade = tradeMapper.toEntity(tradeDto);
        trade.setUser(user);

        user.addTrade(trade);

        TradeDto newTrade = tradeMapper.toDto(tradeRepository.save(trade));

        // Update portfolio

        // 3.1 Get user's "Position" portfolio
        PortfolioDto portfolioDto = portfolioService.getUserDefaultPortfolio();

        PortfolioItemDto itemDto = portfolioItemService.getOrCreatePortfolioItem(
                tradeDto.getStockDto(),
                portfolioDto);

        // 3.3 Update item based on buy or sell
        if (trade.getBuyPrice() != null && trade.getBuyPrice() > 0) {

            // Buy logic
            buyLogic(trade, itemDto);

        } else if (trade.getSellPrice() != null && trade.getSellPrice() > 0) {

            // Sell logic
            sellLogic(trade, itemDto, portfolioDto);
        }
        return newTrade;
    }

    @Transactional
    public TradeDto createBuyTrade(BuyTradeRequest tradeDto) {
        User user = userRepository.findById(SecurityUtil.getAuthenticatedUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Trade trade = tradeMapper.toEntity(tradeDto);
        trade.setUser(user);

        user.addTrade(trade);

        TradeDto newTrade = tradeMapper.toDto(tradeRepository.save(trade));

        // Get user's "Position" portfolio
        PortfolioDto portfolioDto = portfolioService.getUserDefaultPortfolio();

        PortfolioItemDto itemDto = portfolioItemService.getOrCreatePortfolioItem(
                tradeDto.getStockDto(),
                portfolioDto);

        // Buy logic
        buyLogic(trade, itemDto);

        return newTrade;
    }

    @Transactional
    public TradeDto createSellTrade(SellTradeRequest tradeDto) {
        User user = userRepository.findById(SecurityUtil.getAuthenticatedUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Get user's "Position" portfolio
        PortfolioDto portfolioDto = portfolioService.getUserDefaultPortfolio();

        PortfolioItemDto itemDto = portfolioItemService.getPortfolioItemByStockSymbol(
                portfolioDto.getId(),
                tradeDto.getStockSymbol());

        if (itemDto == null) {
            throw ApiException.builder()
                    .status(400)
                    .message("No holdings found for stock: " + tradeDto.getStockSymbol())
                    .build();
        }

        // sell quantity validation
        if (tradeDto.getQuantity() > itemDto.getQuantity()) {
            throw ApiException.builder()
                    .status(400)
                    .message("Sell quantity exceeds holdings for stock: " + tradeDto.getStockSymbol())
                    .build();
        }

        Trade trade = tradeMapper.toEntity(tradeDto);
        trade.setUser(user);

        user.addTrade(trade);

        TradeDto newTrade = tradeMapper.toDto(tradeRepository.save(trade));

        // Sell logic
        sellLogic(trade, itemDto, portfolioDto);

        return newTrade;
    }

    public void buyLogic(Trade trade, PortfolioItemDto itemDto) {
        // Buy logic
        double totalCost = itemDto.getAverageCost() * itemDto.getQuantity();
        double newTradeCost = trade.getBuyPrice() * trade.getQuantity();
        double newQuantity = itemDto.getQuantity() + trade.getQuantity();
        double newAverageCost = (totalCost + newTradeCost) / newQuantity;

        itemDto.setAverageCost(newAverageCost);
        itemDto.setQuantity(newQuantity);
        PortfolioItemDto savedPortfolioItemDto = portfolioItemService.updatePortfolioItem(itemDto);
        System.out.println("Updated portfolio item: " +
                savedPortfolioItemDto.toString());
    }

    public void sellLogic(Trade trade, PortfolioItemDto itemDto, PortfolioDto portfolioDto) {
        double newQuantity = itemDto.getQuantity() - trade.getQuantity();
        itemDto.setQuantity(Math.max(newQuantity, 0.0));

        // update portfolio's realized gain
        double realizedGain = (trade.getSellPrice() - itemDto.getAverageCost()) * trade.getQuantity();

        portfolioDto.setRealizedGain(realizedGain + portfolioDto.getRealizedGain());
        portfolioService.updatePortfolio(portfolioDto);

        // Optional: Delete Portfolio Item if Fully sold
        if (newQuantity <= 0) {
            portfolioItemService.deletePortfolioItemById(itemDto.getId());

            Long stockId = stockService.getStockBySymbol(trade.getStockSymbol()).getId();
            Long watchlistId = watchlistService.getDefaultWatchlist().getId();

            // Delete stock from watchlist
            watchlistService.removeStockFromWatchlist(watchlistId, stockId);

            // return newTrade;
        } else {
            PortfolioItemDto savedPortfolioItemDto = portfolioItemService.updatePortfolioItem(itemDto);
            System.out.println("Updated portfolio item: " +
                    savedPortfolioItemDto.toString());
        }

    }

    // // Do later
    // public TradeDto updateTrade(TradeDto tradeDto, String userId){
    //
    // }

    @Transactional
    public void deleteTradeByDetails(TradeDto tradeDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        UserDto userDto = userMapper.toDto(user);

        tradeDto.setUserDto(userDto);

        List<Trade> trades = tradeRepository.findMatchingTrades(
                tradeDto.getStockSymbol(),
                tradeDto.getBuyPrice(),
                tradeDto.getSellPrice(),
                tradeDto.getQuantity(),
                tradeDto.getBuyDate(),
                tradeDto.getSellDate(),
                userDto.getId());

        if (!trades.isEmpty()) {
            Trade firstTrade = trades.get(0);
            Long tradeId = tradeMapper.toDto(firstTrade).getId();
            System.out.println(tradeId);
            tradeRepository.deleteById(tradeId);
        }

    }

    @Transactional
    public void deleteTradeById(Long tradeId) {
        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist is not exists"));

        if (!trade.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Not your watchlist");
        }
        tradeRepository.deleteById(tradeId);
    }

}
