package com.example.backend.stock;

import com.example.backend.stock.dto.CreateStockRequest;
import com.example.backend.stock.dto.StockDto;
import com.example.backend.util.Client;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stock")
@Client
public class StockController {
    private final StockService stockService;

    // private final WebClient webClient;

    public StockController(
            StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping()
    public ResponseEntity<StockDto> createStock( // Add stock to watchlist
            @Valid @RequestBody CreateStockRequest createStockRequest) {
        System.out.println("Put Stock");
        StockDto savedStockDto = stockService.createStock(createStockRequest);
        return new ResponseEntity<>(savedStockDto, HttpStatus.CREATED);
    }

    @GetMapping({ "/all" })
    public ResponseEntity<List<StockDto>> getAllStocks() {
        System.out.println("Get all Stocks");

        return new ResponseEntity<>(stockService.getAllStocks(), HttpStatus.OK);
    }

    // @GetMapping("{stockSymbol}")
    // public ResponseEntity<StockDto> getStockByStockSymbol(
    // @PathVariable("stockSymbol") String symbol) {
    // System.out.println("Find by stock symbol");
    // StockDto stockDto = stockService.getStockBySymbol(symbol);

    // return new ResponseEntity<>(stockDto, HttpStatus.OK);
    // }

    @GetMapping("/byWatchlist/{watchlistId}")
    public ResponseEntity<Set<StockDto>> getStocksByWatchlistId(
            @PathVariable("watchlistId") Long id) {
        return new ResponseEntity<>(stockService.getStocksByWatchlistId(id), HttpStatus.OK);
    }

    // Search stocks by stock symbol
    @GetMapping("/search/{symbol}")
    public ResponseEntity<List<StockDto>> searchStocks(
            @PathVariable("symbol") String symbol) {
        return new ResponseEntity<>(stockService.searchStocks(symbol), HttpStatus.OK);
    }

    // Search stock by id
    @GetMapping("/id/{id}")
    public ResponseEntity<StockDto> getStockById(
            @PathVariable("id") Long id) {
        return new ResponseEntity<>(stockService.getStock(id), HttpStatus.OK);
    }

    // // TODO Add stocks to watchlist
    // @PostMapping()
    // public ResponseEntity<Void> addStockToWatchlist(
    // ){
    // return ResponseEntity.ok().build();
    // }

    // TODO
    // Check a stock is existed in database
}
