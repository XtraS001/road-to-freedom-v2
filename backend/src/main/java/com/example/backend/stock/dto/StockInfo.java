package com.example.backend.stock.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class StockInfo {
    private String exchange;
    private String name;
    // private String shortname;
    private String quoteType;
    private String symbol;
    private String index;
    // private int score;
    private String typeDisp;
    // private String longname;
    private String exchDisp;
    // private String sector;
    // private String sectorDisp;
    // private String industry;
    // private String industryDisp;
    // private Boolean dispSecIndFlag;
    // private Boolean isYahooFinance;

    // Getters and Setters (or @Data if using Lombok)
}

