package com.example.backend.trade;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.example.backend.trade.dto.BuyTradeRequest;
import com.example.backend.trade.dto.SellTradeRequest;
import com.example.backend.trade.dto.TradeDto;
import com.example.backend.trade.dto.TradeRequest;
import com.example.backend.util.Client;

import java.util.List;

@RestController
@RequestMapping("/api/trade")
@Client
public class TradeController {
    private final TradeService tradeService;

    public TradeController(TradeService tradeService) {
        this.tradeService = tradeService;
    }

    @GetMapping
    public List<TradeDto> getTrades() {
        System.out.println("Get trades");

        return tradeService.getTrades();
    }

    @PostMapping
    public TradeDto createTrade(
            @RequestBody TradeRequest tradeRequest) {

        System.out.println("Create Trade");
        
        return tradeService.createTrade(tradeRequest);
    }

    @PostMapping("/buy")
    public TradeDto createBuyTrade(
            @RequestBody BuyTradeRequest tradeRequest) {

        System.out.println("Create Buy Trade");
        
        return tradeService.createBuyTrade(tradeRequest);
    }

    @PostMapping("/sell")
    public TradeDto createSellTrade(
            @RequestBody SellTradeRequest tradeRequest) {

        System.out.println("Create Sell Trade");
        
        return tradeService.createSellTrade(tradeRequest);
    }

    @DeleteMapping({"/{id}"})
    public ResponseEntity<TradeDto> deleteTrade(
        @PathVariable("id") Long id
    ) {
        System.out.println("Delete Trade");
        tradeService.deleteTradeById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // ToDo settle portfolio mapper not exist problem
    // @PostMapping
    // public ResponseEntity<TradeDto> createTrade(@AuthenticationPrincipal
    // OAuth2User principal,
    // @RequestBody TradeDto tradeDto) {
    // System.out.println("Create Trade");
    // TradeDto savedTrade = tradeService.createTrade(tradeDto);
    // return new ResponseEntity<>(savedTrade, HttpStatus.OK);
    // }

    // @DeleteMapping
    // public ResponseEntity<TradeDto> deleteTrade(@AuthenticationPrincipal OAuth2User principal,
    //         @RequestBody TradeDto tradeDto) {
    //     System.out.println("Delete Trade");
    //     tradeService.deleteTradeByDetails(tradeDto);
    //     return new ResponseEntity<>(HttpStatus.OK);
    // }

}
