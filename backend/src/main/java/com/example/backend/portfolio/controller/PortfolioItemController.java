package com.example.backend.portfolio.controller;

import com.example.backend.portfolio.service.PortfolioItemService;
import com.example.backend.portfolio.service.PortfolioService;
import com.example.backend.util.Client;
import com.example.backend.portfolio.dto.PortfolioItemDto;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/portfolioItem")
@Client
public class PortfolioItemController {

    private final PortfolioItemService portfolioItemService;
    private final PortfolioService portfolioService;

    public PortfolioItemController(PortfolioItemService portfolioItemService, PortfolioService portfolioService) {
        this.portfolioItemService = portfolioItemService;
        this.portfolioService = portfolioService;
    }

    // @GetMapping
    // public List<PortfolioItemDto> getPortfolioItem(){
    // System.out.println("Get portfolio items");;
    // Long portfolioId = portfolioService.getUserPortfolio().getId();

    // return portfolioItemService.getPortfolioItems(portfolioId);
    // }

    // @GetMapping
    // public List<PortfolioItemDto> getPortfolioItem(@AuthenticationPrincipal
    // OAuth2User principal){
    // System.out.println("Get portfolio items");
    // String userId = principal.getAttribute("sub");
    // Long portfolioId = portfolioService.getUserPortfolio(userId).getId();

    // return portfolioItemService.getPortfolioItems(portfolioId);
    // }

    // Get portfolio items with portfolio Id
    @GetMapping("/byPortfolio/{portfolioId}")
    public List<PortfolioItemDto> getPortfolioItems(
            @PathVariable() Long portfolioId) {
        System.out.println("Get portfolio items");

        return portfolioItemService.getPortfolioItems(portfolioId);
    }

    // Get 1 portfolio item
    @GetMapping("/item/{itemId}")
    public PortfolioItemDto getPortfolioItem(
            @PathVariable("itemId") Long itemId) {
        System.out.println("Get 1 portfolio item");

        return portfolioItemService.getPortfolioItem(itemId);
    }

    // Delete 1 portfolio item
    @DeleteMapping("/{itemId}")
    public void deletePortfolioItem(
            @PathVariable("itemId") Long itemId) {
        System.out.println("Delete 1 portfolio item");
        portfolioItemService.deletePortfolioItemById(itemId);
    }

    // Create 1 portfolio item For testing only
    @PostMapping()
    public PortfolioItemDto createPortfolioItem(
            @RequestBody PortfolioItemDto itemDto) {
        System.out.println("Create 1 portfolio item");
        return portfolioItemService.createPortfolioItem(itemDto);
    }

    // Edit 1 portfolio item For testing only
    @PutMapping()
    public PortfolioItemDto editPortfolioItem(
            @RequestBody PortfolioItemDto itemDto) {
        System.out.println("Edit 1 portfolio item");
        return portfolioItemService.updatePortfolioItem(itemDto);
    }
}
