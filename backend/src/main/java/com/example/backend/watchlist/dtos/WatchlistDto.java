package com.example.backend.watchlist.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

import com.example.backend.users.data.UserDto;
import com.example.backend.util.Client;

import jakarta.validation.constraints.NotBlank;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Client
public class WatchlistDto {
    private Long id;

    @NotBlank
    private String name;
    private UserDto userDto;

    private Set<Long> stockIds; // Can consider have WatchlistDetailsDto to use StocksDto
}