package com.example.backend.stock;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.backend.stock.dto.StockDto;

import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockPriceUpdater {

    private final WebClient webClient;
    private final StockService stockService;
    // private final PortfolioItemRepository portfolioItemRepository;

    // @Scheduled(fixedRate = 15 * 60 * 1000)
    // @Scheduled(fixedRate = 5 * 1000)
    // public void updateStockPrices() {
    // System.out.println("Updating price");
    //
    // System.out.println(webClient.get().uri("/").retrieve());
    // webClient.post().uri("/stocks").body()
    //// List<PortfolioItem> items = portfolioItemRepository.findAll();
    ////
    //// // Get distinct stock symbols to avoid duplicate API calls
    //// Set<String> symbols = items.stream()
    //// .map(PortfolioItem::getStockSymbol)
    //// .collect(Collectors.toSet());
    ////
    //// for (String symbol : symbols) {
    //// try {
    //// StockPriceResponse response = webClient.get()
    //// .uri("/api/stocks/{symbol}", symbol) // adjust path if needed
    //// .retrieve()
    //// .bodyToMono(StockPriceResponse.class)
    //// .block(); // block() converts async to sync; safe in scheduled tasks
    ////
    //// if (response != null) {
    //// // Update all items with this symbol
    //// for (PortfolioItem item : items) {
    //// if (item.getStockSymbol().equals(symbol)) {
    //// item.setCurrentQuote(response.getCurrentPrice());
    //// }
    //// }
    //// }
    ////
    //// } catch (Exception e) {
    //// System.err.println("Failed to fetch for " + symbol + ": " +
    // e.getMessage());
    //// }
    //// }
    //
    // // Save all at once (optional)
    //// portfolioItemRepository.saveAll(items);
    // System.out.println("Done update");
    // }

    // @Autowired
    // public StockPriceUpdater(WebClient webClient) {
    // this.webClient = webClient;
    // }

    /// / A working scheduled function
    // @Scheduled(fixedRate = 5 * 60 * 1000) // every 15 minutes
    // public void updateStockPrices() {
    // System.out.println("Fetching updated stock prices...");
    //
    // List<String> symbols = List.of("BTC-USD", "NVDA");
    //
    // webClient.post()
    // .uri("/update-stocks")
    // .bodyValue(symbols)
    // .retrieve()
    // .bodyToMono(Map.class) // Map<String, Double>
    // .doOnNext(prices -> {
    // System.out.println("Received stock prices:");
    // prices.forEach((symbol, price) ->
    // System.out.println(symbol + " -> " + price));
    // // You can update your database here with these prices
    //
    //
    // })
    // .doOnError(error -> System.err.println("Error fetching prices: " +
    /// error.getMessage()))
    // .subscribe();
    //
    // // Complete ver pseudocode:
    // // Get all stocks name from form db
    // // Send get update price request
    // // Write Into database
    // // Calculate unrealized gain for each portfolio
    // // update portfolio
    // }

    @Scheduled(fixedRate = 15 * 60 * 1000) // every 15 minutes
    // @Scheduled(fixedRate = 10 * 1000) // every 10 seconds
    public void updateStockPrices() {
        System.out.println("Fetching updated stock prices...");

        // List<String> symbols = List.of("BTC-USD", "NVDA");
        List<StockDto> allStocks = stockService.getAllStocks();
        if (allStocks == null || allStocks.isEmpty()) {
            System.out.println("No stocks to update");
        return;
        }

        List<String> allSymbols = allStocks.stream()
                .map(StockDto::getSymbol)
                .toList();
        System.out.println("All Symbols" + allSymbols);
        Map<String, Double> priceResponseMono = webClient.post()
                .uri("/update-stocks")
                .bodyValue(allSymbols) // allSymbols: List<String>
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Double>>() {
                })
                .block(); // Mono<Map<String, Double>> -> Map<String,Double>

        // Update the currentQuote field
        for (StockDto stockDto : allStocks) {
            Double newQuote = priceResponseMono.get(stockDto.getSymbol());
            if (newQuote != null) {
                stockDto.setCurrentQuote(newQuote);
            }
        }

        stockService.updateStockByBulk(allStocks);

        // // Update the currentQuote field
        // for (Stock stock : stocksToUpdate) {
        // Double newQuote = symbolToQuoteMap.get(stock.getSymbol());
        // if (newQuote != null) {
        // stock.setCurrentQuote(newQuote);
        // }
        // }

        // webClient.post()
        // .uri("/update-stocks")
        // .bodyValue(allSymbols)
        // .retrieve()
        // .bodyToMono(Map.class) // Map<String, Double>
        // .doOnNext(prices -> {
        // System.out.println("Received stock prices:");
        // prices.forEach((symbol, price) ->
        // System.out.println(symbol + " -> " + price));
        // // You can update your database here with these prices
        //
        //
        // })
        // .doOnError(error -> System.err.println("Error fetching prices: " +
        // error.getMessage()))
        // .subscribe();

        // Complete ver pseudocode:
        // Get all stocks name from form db
        // Send get update price request
        // Write Into database
        // Calculate unrealized gain for each portfolio
        // update portfolio
    }

}
