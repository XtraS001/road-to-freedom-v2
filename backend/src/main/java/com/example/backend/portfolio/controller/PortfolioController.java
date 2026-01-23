package com.example.backend.portfolio.controller;

import com.example.backend.portfolio.service.PortfolioService;
import com.example.backend.util.Client;
import com.example.backend.watchlist.dtos.WatchlistDto;
import com.example.backend.portfolio.dto.PortfolioDto;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/portfolio")
@Client
public class PortfolioController {
    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    // @GetMapping
    // public ResponseEntity<List<PortfolioDto>> getPortfolio() {
    // List<PortfolioDto> portfolioDtos = portfolioService.getUserPortfolio();
    // return ResponseEntity.ok(portfolioDtos);
    // }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioDto> getPortfolioById(
            @PathVariable("id") Long portfolioId) {
        System.out.println("Get Portfolio by id");
        PortfolioDto portfolioDto = portfolioService.getPortfolioById(portfolioId);
        return new ResponseEntity<>(portfolioDto, HttpStatus.OK);
    }

    @GetMapping("/portfolios")
    public List<PortfolioDto> getUserPortfolio() {
        List<PortfolioDto> portfolioDtos = portfolioService.getUserPortfolio();
        return portfolioDtos;
    }

    @PostMapping("")
    public ResponseEntity<PortfolioDto> createPortfolio(
            @RequestBody PortfolioDto portfolioDto) {
        System.out.println("Controller PortfolioDto Name: " + portfolioDto.getPortfolioName());
        PortfolioDto savedPortfolio = portfolioService.createPortfolio(portfolioDto);
        return ResponseEntity.ok(savedPortfolio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PortfolioDto> deletePortfolio(
            @PathVariable("id") Long portfolioId) {
        System.out.println("Delete Portfolio");
        portfolioService.deletePortfolio(portfolioId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/unrealizedGain/{id}")
    public ResponseEntity<Double> calculateUnrealizedGain(
            @PathVariable("id") Long id) {
        double unrealizedGain = portfolioService.calculateUnrealizedGain(id);
        return ResponseEntity.ok(unrealizedGain);
    }

    @GetMapping("/defaultPortfolio")
    public ResponseEntity<PortfolioDto> getDefaultPortfolio() {
        PortfolioDto defaultPortfolio = portfolioService.getUserDefaultPortfolio();

        return ResponseEntity.ok(defaultPortfolio);
    }
}
