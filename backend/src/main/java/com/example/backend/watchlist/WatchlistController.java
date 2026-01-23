package com.example.backend.watchlist;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.stock.dto.StockDto;
import com.example.backend.util.Client;
import com.example.backend.watchlist.dtos.WatchlistDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
@Client
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping
    public List<WatchlistDto> getWatchlists() {
        System.out.println("Get /api/watchlist");
        return watchlistService.getUserWatchlists();
    }

    @PostMapping("")
    public ResponseEntity<WatchlistDto> createWatchlist(
            @RequestBody WatchlistDto watchlistDto) {
        System.out.println("Controller WatchlistDto Name: " + watchlistDto.getName());
        WatchlistDto savedWatchlist = watchlistService.createWatchlist(watchlistDto);
        return ResponseEntity.ok(savedWatchlist);
    }

    // Get watchlist by name. To be continue... Complete mapping first
    @GetMapping("/name/{name}")
    public ResponseEntity<WatchlistDto> getWatchlistByName(
            @PathVariable String name) {
        System.out.println("Get watchlist by name");

        return ResponseEntity.ok(watchlistService.getWatchlistByName(name));
    }

    @GetMapping("{id}")
    public ResponseEntity<WatchlistDto> getWatchlistById(
            @PathVariable("id") Long watchlistId) {
        System.out.println("Get watchlist by id");

        WatchlistDto watchlistDto = watchlistService.getWatchlistById(watchlistId);
        return new ResponseEntity<>(watchlistDto, HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<WatchlistDto> updateWatchlistById(
            @PathVariable("id") Long watchlistId,
            @RequestBody WatchlistDto updatedWatchlist) {
        System.out.println("Update watchlist by name");

        WatchlistDto watchlistDto = watchlistService.updateWatchlistById(watchlistId, updatedWatchlist);

        return new ResponseEntity<>(watchlistDto, HttpStatus.OK);
    }

    @PutMapping("/byName/{name}")
    public ResponseEntity<WatchlistDto> updateWatchlist(
            @PathVariable("name") String watchlistName,
            @RequestBody WatchlistDto updatedWatchlist) {
        System.out.println("Update watchlist by name");

        WatchlistDto watchlistDto = watchlistService.updateWatchlist(watchlistName, updatedWatchlist);

        return new ResponseEntity<>(watchlistDto, HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<WatchlistDto> deleteWatchlist(
            @PathVariable("id") Long watchlistId) {
        System.out.println("Delete Watchlist");

        watchlistService.deleteWatchlist(watchlistId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // TODO grok old ver.
    // @PutMapping("{watchlistName}/stock/{stockSymbol}")
    // public ResponseEntity<WatchlistDto> addStockToWatchlist(
    //         // @AuthenticationPrincipal OAuth2User principal,
    //         @PathVariable("watchlistName") String watchlistName,
    //         @PathVariable("stockSymbol") String stockSymbol) {
    //     System.out.println("Add stock to watchlist");
    //     WatchlistDto savedWatchlist = watchlistService.addStockToWatchlist(
    //             principal.getAttribute("sub"),
    //             watchlistName,
    //             stockSymbol);

    //     return new ResponseEntity<>(savedWatchlist, HttpStatus.OK);
    // }

    // Add 1 stock to watchlist
    @PostMapping("/addStock/{watchlistId}")
    public ResponseEntity<WatchlistDto> addStockToWatchlist(
        @PathVariable Long watchlistId,
        @RequestBody StockDto newStock  // Need to include stock ID if stock is saved before
    ){
        WatchlistDto updatedWatchlist = watchlistService.addStockToWatchlist(watchlistId, newStock);
        return ResponseEntity.ok(updatedWatchlist);
    }
    
    // TODo: Remove 1 stock from watchlist
    @DeleteMapping("/{watchlistId}/stocks/{stockId}")
    public ResponseEntity<WatchlistDto> removeStockFromWatchlist(
            @PathVariable Long watchlistId,
            @PathVariable Long stockId
    ) {
        WatchlistDto updated = watchlistService.removeStockFromWatchlist(watchlistId, stockId);
        return ResponseEntity.ok(updated);
    }
}

// Watchlist Controller Plan
// Create Watchlist 1 by 1. Add or remove stock in watchlist 1 by 1