package com.example.backend.trade;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TradeRepository extends JpaRepository<Trade, Long> {
        List<Trade> findByUserId(Long userId);

        @Transactional
        @Modifying
        @Query(value = """
                        DELETE FROM trade
                        WHERE ctid IN (
                            SELECT ctid FROM trade
                            WHERE stock_symbol = :stockSymbol
                              AND buy_price = :buyPrice
                              AND sell_price = :sellPrice
                              AND quantity = :quantity
                              AND buy_date = :buyDate
                              AND sell_date = :sellDate
                              AND user_id = :userId
                            LIMIT 1
                        )
                        """, nativeQuery = true)
        int deleteSingleTrade(@Param("stockSymbol") String stockSymbol,
                        @Param("buyPrice") Double buyPrice,
                        @Param("sellPrice") Double sellPrice,
                        @Param("quantity") Long quantity,
                        @Param("buyDate") LocalDateTime buyDate,
                        @Param("sellDate") LocalDateTime sellDate,
                        @Param("userId") Long userId);

        // List<Trade> findByTrade(Trade trade);

        @Query("SELECT t FROM Trade t WHERE t.stockSymbol = :stockSymbol " +
                        "AND (t.buyPrice = :buyPrice OR t.sellPrice = :sellPrice) " +
                        "AND t.quantity = :quantity " +
                        "AND (t.buyDate = :buyDate OR t.sellDate = :sellDate) " +
                        "AND t.user.id = :userId")
        List<Trade> findMatchingTrades(@Param("stockSymbol") String stockSymbol,
                        @Param("buyPrice") Double buyPrice,
                        @Param("sellPrice") Double sellPrice,
                        @Param("quantity") Long quantity,
                        @Param("buyDate") LocalDateTime buyDate,
                        @Param("sellDate") LocalDateTime sellDate,
                        @Param("userId") Long userId);
}