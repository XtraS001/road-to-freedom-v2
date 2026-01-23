package com.example.backend.portfolio.service;

import com.example.backend.portfolio.mapper.PortfolioMapper;
import com.example.backend.portfolio.repository.PortfolioRepository;
import com.example.backend.stock.StockService;
import com.example.backend.stock.dto.StockDto;
import com.example.backend.auth.SecurityUtil;
import com.example.backend.common.DefaultValues;
import com.example.backend.portfolio.Portfolio;
import com.example.backend.portfolio.dto.PortfolioDto;
import com.example.backend.portfolio.dto.PortfolioItemDto;
import com.example.backend.users.User;
import com.example.backend.users.data.UserDto;
import com.example.backend.users.mapper.UserMapper;
import com.example.backend.users.repository.UserRepository;
import com.example.backend.util.exception.ResourceNotFoundException;
import com.example.backend.util.exception.UnauthorizedException;

import jakarta.persistence.EntityNotFoundException;

import com.example.backend.portfolio.Portfolio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PortfolioService {
    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    private final StockService stockService;
    private final PortfolioItemService portfolioItemService;
    @Autowired
    private PortfolioMapper portfolioMapper;

    @Autowired
    private UserMapper userMapper;

    public PortfolioService(
            PortfolioRepository portfolioRepository,
            UserRepository userRepository,
            StockService stockService,
            PortfolioItemService portfolioItemService) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
        this.stockService = stockService;
        this.portfolioItemService = portfolioItemService;
    }

    // public Portfolio getUserPortfolio(String userId) {
    // Portfolio portfolio = portfolioRepository.findByUserId(userId);
    // if (portfolio == null) {
    // portfolio = new Portfolio();
    // portfolio.setUser(new User(userId));
    //// portfolio.getUser().setId(userId);
    // portfolio = portfolioRepository.save(portfolio);
    // }
    // System.out.println("A portfolio is created");
    // System.out.println(portfolio);
    // return portfolio;
    // }

    public PortfolioDto getPortfolioById(Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new EntityNotFoundException("Portfolio not found"));
        return portfolioMapper.toDto(portfolio);
    }

    public List<PortfolioDto> getUserPortfolio() {
        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);

        return portfolios.stream().map(
                (portfolio) -> portfolioMapper.toDto(portfolio)).toList();

        // if(portfolio == null){
        // PortfolioDto newPortfolioDto = new PortfolioDto();
        // UserDto userDto = userMapper.toDto(user);
        // newPortfolioDto.setPortfolioName("Default");
        // newPortfolioDto.setUserDto(userDto);
        // portfolioRepository.save(portfolioMapper.toEntity(newPortfolioDto));
        // return newPortfolioDto;
        // }

        // return portfolioMapper.toDto(portfolio);

    }

    public PortfolioDto getUserDefaultPortfolio() {
        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);

        Portfolio positionPortfolio = portfolios.stream()
                .filter(p -> DefaultValues.DEFAULT_PORTFOLIO_NAME.equals(p.getPortfolioName()))
                .findFirst()
                .orElse(null);

        calculateUnrealizedGain(positionPortfolio.getId());

        return positionPortfolio != null ? portfolioMapper.toDto(positionPortfolio) : null;
    }

    @Transactional
    public PortfolioDto createPortfolio(PortfolioDto portfolioDto) {
        User user = userRepository.findById(SecurityUtil.getAuthenticatedUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Portfolio portfolio = portfolioMapper.toEntity(portfolioDto);
        portfolio.setUser(user);

        user.addPortfolio(portfolio);

        return portfolioMapper.toDto(portfolioRepository.save(portfolio));

    }

    // public PortfolioDto updatePortfolio(PortfolioDto portfolioDto) {

    // return portfolioRepository.save(portfolio);
    // }

    @Transactional
    public PortfolioDto updatePortfolio(PortfolioDto updatedPortfolio) {
        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        Portfolio portfolio = portfolioRepository.findById(updatedPortfolio.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Portfolio not found"));

        if (!portfolio.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Not your watchlist");
        }
        portfolio.setPortfolioName(updatedPortfolio.getPortfolioName());
        portfolio.setRealizedGain(updatedPortfolio.getRealizedGain()); // Remember to set realized gain when calling the
                                                                       // method
        portfolio.setUnrealizedGain(updatedPortfolio.getUnrealizedGain());

        portfolioRepository.save(portfolio);

        return portfolioMapper.toDto(portfolio);
    }

    @Transactional
    public void deletePortfolio(Long portfolioId) {
        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio is not exists"));

        if (!portfolio.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Not your portfolio");
        }

        // Prevent deletion of the default portfolio
        if (DefaultValues.DEFAULT_PORTFOLIO_NAME.equals(portfolio.getPortfolioName())) {
            throw new IllegalArgumentException("Default portfolio cannot be deleted");
        }
        // portfolioRepository.deleteByNameAndUserId(name, userId);
        portfolioRepository.deleteById(portfolio.getId());
    }

    @Transactional
    public double calculateUnrealizedGain(Long portfolioId) {
        // Calculate unrealized gain for the portfolio with the given ID
        // and update the portfolio in the database

        PortfolioDto portfolioDto = getPortfolioById(portfolioId);

        List<PortfolioItemDto> portfolioItems = portfolioItemService.getPortfolioItems(portfolioId);

        List<String> symbols = portfolioItems.stream().map(PortfolioItemDto::getStockSymbol)
                .collect(Collectors.toList());
        List<StockDto> stocks = stockService.getStocksBySymbols(symbols);

        // update portfolioItems currentQuote
        for (PortfolioItemDto item : portfolioItems) {
            StockDto stock = stocks.stream().filter(s -> s.getSymbol().equals(item.getStockSymbol())).findFirst()
                    .orElse(null);
            if (stock != null) {
                item.setCurrentQuote(stock.getCurrentQuote());
            }
        }

        // calculate portfolioDto unrealizedGain
        // sum += (currentQuote - averageCost) * quantity
        // for each item
        double sum = 0.0;
        for (PortfolioItemDto item : portfolioItems) {

            sum += (item.getCurrentQuote() - item.getAverageCost()) * item.getQuantity();
            sum = Math.round(sum * 100.0) / 100.0; // Temporary // TODO change double to BigDecimal
        }
        portfolioDto.setUnrealizedGain(sum);
        updatePortfolio(portfolioDto);

        return sum;
    }
}