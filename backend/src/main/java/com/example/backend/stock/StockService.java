package com.example.backend.stock;

import com.example.backend.stock.dto.CreateStockRequest;
import com.example.backend.stock.dto.StockDto;
import com.example.backend.util.exception.ResourceNotFoundException;
import com.example.backend.watchlist.Watchlist;
import com.example.backend.watchlist.WatchlistRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StockService {
    @Autowired
    private StockMapper stockMapper;

    private final StockRepository stockRepository;
    private final WatchlistRepository watchlistRepository;

    private final WebClient webClient;

    public StockService(
            StockRepository stockRepository,
            WatchlistRepository watchlistRepository,
            WebClient webClient) {
        this.stockRepository = stockRepository;
        this.watchlistRepository = watchlistRepository;
        this.webClient = webClient;
    }

    // For testing purposes not for prod
    // @Transactional
    // public StockDto createStock(StockDto stockDto) {
    // Stock stock = stockMapper.toEntity(stockDto);
    // if (stockDto.getWatchlistIds() != null) {
    // Set<Watchlist> watchlists = new
    // HashSet<>(watchlistRepository.findAllById(stockDto.getWatchlistIds()));
    // if (watchlists.size() != stockDto.getWatchlistIds().size()) {
    // throw new IllegalArgumentException("Some watchlists not found");
    // }
    // stock.setWatchlists(watchlists);
    // }
    // return stockMapper.toDto(stockRepository.save(stock));
    // }

    public StockDto getStock(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stock not found: " + id));
        StockDto stockDto = stockMapper.toDto(stock);
        if (stock.getWatchlists() != null) {
            stockDto.setWatchlistIds(stock.getWatchlists().stream()
                    .map(Watchlist::getId)
                    .collect(Collectors.toSet()));
        }
        return stockDto;
    }

    public List<StockDto> getAllStocks() {
        List<StockDto> allStocks = stockRepository.findAll().stream().map(stockMapper::toDto).toList();
        System.out.println("StockService: ALl stocks are" + allStocks);
        return allStocks;
    }

    public StockDto getStockBySymbol(String symbol) {
        return stockMapper.toDto(stockRepository.findBySymbol(symbol));
    }

    @Transactional
    // For renewing stocks data using webclient
    public List<StockDto> updateStockByBulk(List<StockDto> stockDtos) {
        // New ver. Pervious ver. create new stocks, not updating old ones
        List<Stock> updated = new ArrayList<>();

        for (StockDto dto : stockDtos) {
            Stock existing = stockRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Stock not found: " + dto.getSymbol()));

            // Update only fields that are meant to change
            existing.setCurrentQuote(dto.getCurrentQuote());

            // … add remaining fields

            updated.add(existing); // entity is managed already
        }

        return updated.stream().map(stockMapper::toDto).toList();
    }

    // Return stocks in a watchlist
    public Set<StockDto> getStocksByWatchlistId(Long watchlistId) {

        return stockRepository.findByWatchlists_Id(watchlistId)
                .stream().map(stockMapper::toDto).collect(Collectors.toSet());
    }

    // Add stock to watchlist, prevent repeated stock
    @Transactional
    public StockDto createStock(CreateStockRequest stockDto) {

        // Check if stock already exists
        Stock stock = stockRepository.findBySymbolAndNameAndExchange(
                stockDto.getSymbol(),
                stockDto.getName(),
                stockDto.getExchange());

        // if stock not exist
        if (stock == null) { // Create stock first
            stock = new Stock(
                stockDto.getSymbol(), 
                stockDto.getName(), 
                stockDto.getExchange(),
                stockDto.getCurrentQuote()
            );
            stock = stockRepository.save(stock);
        }

        // Find watchlist
        Watchlist watchlist = watchlistRepository.findById(stockDto.getWatchlistId())
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist not found"));

        // associate stock to watchlist
        watchlist.addStock(stock);
        watchlistRepository.save(watchlist);

        return stockMapper.toDto(stock);
    }

    // Search stocks by stock symbol using fastapi
    public List<StockDto> searchStocks(String symbol) {
        // System.out.println("Search stocks by symbol: " + symbol);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/stocks/symbols/{symbol}")
                        .build(symbol))
                .retrieve()
                .bodyToFlux(StockDto.class)
                .collectList()
                .block(); // block because you're inside a service method (imperative)
    }

    // Search single stock using fastapi
    public StockDto searchStock(String symbol) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/stock/{symbol}")
                        .build(symbol))
                .retrieve()
                .bodyToMono(StockDto.class)
                .block();
    }

    public List<StockDto> getStocksBySymbols(List<String> symbols) {
        return stockRepository.findBySymbolIn(symbols).stream().map(stockMapper::toDto).toList();
    }

    public Object searchStockById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'searchStockById'");
    }
}
