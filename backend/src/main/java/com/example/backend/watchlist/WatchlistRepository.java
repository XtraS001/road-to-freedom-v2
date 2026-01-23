package com.example.backend.watchlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
// import org.springframework.data.jpa.repository.Modifying;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByUserId(Long userId);

    Optional<Watchlist> findByNameAndUserId(String name, Long userId);

    // Returns the first one found, ignores the rest
    Optional<Watchlist> findFirstByNameAndUserId(String name, Long userId);


// ////  Working Fine
// //    @Transactional
// //    void deleteByNameAndUserId(String name, String userId);

//     // A more fined tune and detailed version
//     @Modifying
//     @Transactional
//     @Query("DELETE FROM Watchlist w WHERE w.name = :name AND w.user.id = :userId")
//     void deleteByNameAndUserId(@Param("name") String name, @Param("userId") String userId);
}
