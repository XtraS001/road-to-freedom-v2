package com.example.backend.watchlist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.auth.SecurityUtil;
import com.example.backend.common.DefaultValues;
import com.example.backend.stock.Stock;
import com.example.backend.stock.dto.StockDto;
import com.example.backend.users.User;
import com.example.backend.util.exception.ResourceNotFoundException;
import com.example.backend.util.exception.UnauthorizedException;
import com.example.backend.watchlist.dtos.WatchlistDto;
import com.example.backend.users.repository.UserRepository;
import com.example.backend.stock.StockRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;

@Service
public class WatchlistService {

    private final UserRepository userRepository;
    private final WatchlistRepository watchlistRepository;
    private final StockRepository stockRepository;

    @Autowired
    private WatchlistMapper watchlistMapper;

    public WatchlistService(
            UserRepository userRepository,
            WatchlistRepository watchlistRepository,
            StockRepository stockRepository) {
        this.userRepository = userRepository;
        this.watchlistRepository = watchlistRepository;
        this.stockRepository = stockRepository;
    }

    public WatchlistDto getWatchlistByName(String name) {
        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        Watchlist watchlist = watchlistRepository.findByNameAndUserId(name, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist is not exists with given name: " + name));

        return watchlistMapper.toDto(watchlist);
    }

    @Transactional
    public WatchlistDto updateWatchlist(String watchlistName, WatchlistDto updatedWatchlist) {
        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        Watchlist watchlist = watchlistRepository.findByNameAndUserId(watchlistName, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Watchlist is not exists with given name: " + watchlistName));

        watchlist.setName(updatedWatchlist.getName());
        watchlistRepository.save(watchlist);

        return watchlistMapper.toDto(watchlist);
    }

    public WatchlistDto getWatchlistById(Long watchlistId) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Watchlist is not exists with given id: " + watchlistId));
        WatchlistDto watchlistDto = watchlistMapper.toDto(watchlist);
        return watchlistDto;
    }

    @Transactional
    public WatchlistDto createWatchlist(WatchlistDto watchlistDto) {
        System.out.println("WatchlistDto Name: " + watchlistDto.getName());
        User user = userRepository.findById(SecurityUtil.getAuthenticatedUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        String watchlistName = watchlistDto.getName();
        Watchlist newWatchlist = new Watchlist(watchlistName, user);

        user.addWatchlist(newWatchlist);

        userRepository.save(user);
        WatchlistDto newWatchlistDto = watchlistMapper.toDto(newWatchlist);
        return newWatchlistDto;
    }

    @Transactional
    public WatchlistDto updateWatchlistById(Long watchlistId, WatchlistDto updatedWatchlist) {
        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Watchlist is not exists with given id: " + watchlistId));

        if (!watchlist.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Not your watchlist");
        }

        watchlist.setName(updatedWatchlist.getName());
        return watchlistMapper.toDto(watchlistRepository.save(watchlist));
    }

    @Transactional
    public void deleteWatchlist(Long watchlistId) {
        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist is not exists"));

        if (!watchlist.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Not your watchlist");
        }

        // Prevent deletion of the default watchlist
        if (DefaultValues.DEFAULT_WATCHLIST_NAME.equals(watchlist.getName())) {
            throw new IllegalArgumentException("Default watchlist cannot be deleted");
        }
        // watchlistRepository.deleteByNameAndUserId(name, userId);
        watchlistRepository.deleteById(watchlist.getId());
    }

    public List<WatchlistDto> getUserWatchlists() {
        System.out.println("getUserWatchlists");

        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        List<Watchlist> watchlists = watchlistRepository.findByUserId(userId);

        return watchlists.stream().map(
                (watchlist) -> watchlistMapper.toDto(watchlist)).toList();
        // User user = userRepository.findById(userId).orElseThrow(() -> new
        // EntityNotFoundException("User not found"));

        // if (watchlists.isEmpty()) {
        // Watchlist newWatchlist = new Watchlist("Position", user);

        // user.addWatchlist(newWatchlist);

        // userRepository.save(user);
        // return watchlistRepository.findByUserId(userId).stream().map(
        // (watchlist) -> watchlistMapper.toDto(watchlist)).toList();
        // }

    }

    // TODO addStock old ver.
    // public WatchlistDto addStockToWatchlist(
    // String userId, String watchlistName, String stockSymbol) {
    // Set<Stock> stockSet = null;
    // // Watchlist watchlist = watchlistRepository.findById(watchlistId).get();
    // Watchlist watchlist = watchlistRepository.findByNameAndUserId(watchlistName,
    // userId)
    // .orElseThrow(() -> new ResourceNotFoundException("Watchlist is not exists
    // with given name: " +
    // watchlistName));

    // // Stock stock = stockRepository.findById(stockId).get();
    // Stock stock = stockRepository.findBySymbol(stockSymbol);

    // stockSet = watchlist.getStocks();
    // stockSet.add(stock);
    // watchlist.setStocks(stockSet);
    // Watchlist saveWatchlist = watchlistRepository.save(watchlist);
    // return watchlistMapper.toDto(saveWatchlist);
    // }

    // Add 1 stock to watchlist
    @Transactional
    public WatchlistDto addStockToWatchlist(Long watchlistId, StockDto newStock) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new EntityNotFoundException("Watchlist not found"));

        Stock stock;

        if (newStock.getId() != null) { // Might remove in future
            // Attach existing stock
            stock = stockRepository.findById(newStock.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Stock not found"));
        } else {
            // Create a new stock entity
            stock = new Stock();
            stock.setSymbol(newStock.getSymbol());
            stock.setName(newStock.getName());
            stock.setCurrentQuote(newStock.getCurrentQuote());
            stock = stockRepository.save(stock);
        }

        // Add to watchlist if not already there
        if (!watchlist.getStocks().contains(stock)) {
            watchlist.getStocks().add(stock);
            stock.getWatchlists().add(watchlist);
        }

        return watchlistMapper.toDto(watchlistRepository.save(watchlist));
    }

    // Delete 1 stock from watchlist
    @Transactional
    public WatchlistDto removeStockFromWatchlist(Long watchlistId, Long stockId) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new EntityNotFoundException("Watchlist not found"));

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new EntityNotFoundException("Stock not found"));

        if (watchlist.getStocks().remove(stock)) {
            stock.getWatchlists().remove(watchlist);
        }

        WatchlistDto editedWatchlsitDto = watchlistMapper.toDto(watchlistRepository.save(watchlist));

        if (stock.isOrphan()) {
            stockRepository.delete(stock);
        }

        return editedWatchlsitDto;
    }

    //  Get Default watchlist
    public WatchlistDto getDefaultWatchlist() {
        Long userId = SecurityUtil.getAuthenticatedUser().getId();
        
        Watchlist watchlist = watchlistRepository.findFirstByNameAndUserId(DefaultValues.DEFAULT_WATCHLIST_NAME, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist is not exists with given name: " + DefaultValues.DEFAULT_WATCHLIST_NAME));
                
        return watchlistMapper.toDto(watchlist);
    }
}
