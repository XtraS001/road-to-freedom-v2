package com.example.backend.users;

import com.example.backend.entity.AbstractEntity;
import com.example.backend.portfolio.Portfolio;
import com.example.backend.trade.Trade;
import com.example.backend.users.data.CreateUserRequest;
import com.example.backend.users.data.UpdateUserRequest;
import com.example.backend.util.ApplicationContextProvider;
import com.example.backend.util.Client;
import com.example.backend.watchlist.Watchlist;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;

/**
 * User is an entity that can be authenticated and authorized to access the
 * application.
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
@Client
public class User extends AbstractEntity implements UserDetails {
  private String email;
  private String password;
  private String firstName;
  private String lastName;
  @Setter
  private boolean verified = false;
  @Setter
  private String profileImageUrl;
  @Enumerated(EnumType.STRING)
  @Setter
  private Role role;

  @Setter
  @OneToOne(mappedBy = "user")
  private VerificationCode verificationCode;

  @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
  private List<UserConnectedAccount> connectedAccounts = new ArrayList<>();

  // @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true) // helps clean up children if removed
        // from list
  private List<Watchlist> watchlists = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Trade> trades;

  //    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
//    private Portfolio portfolio; // Updated to one-to-one

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Portfolio> portfolios = new ArrayList<>(); // Updated to one-to-one

  public User(CreateUserRequest data) {
    PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
    this.email = data.getEmail();
    this.password = passwordEncoder.encode(data.getPassword());
    this.firstName = data.getFirstName();
    this.lastName = data.getLastName();
    this.role = Role.USER;
  }

  public User(OAuth2User oAuth2User) {
    User user = new User();
    user.email = oAuth2User.getAttribute("email");
    String name = oAuth2User.getAttribute("name");
    if (name != null) {
      List<String> names = List.of(name.split(" "));
      if (names.size() > 1) {
        user.firstName = names.get(0);
        user.lastName = names.get(1);
      } else {
        user.firstName = names.getFirst();
      }
    }
    user.verified = true;
    user.role = Role.USER;
  }

  public void addConnectedAccount(UserConnectedAccount connectedAccount) {
    connectedAccounts.add(connectedAccount);
  }

  public void update(UpdateUserRequest request) {
    this.firstName = request.getFirstName();
    this.lastName = request.getLastName();
  }

  public void updatePassword(String newPassword) {
    PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
    this.password = passwordEncoder.encode(newPassword);
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.name()));
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  // If you want to not allow the user to login before verifying their email, you
  // can change this to
  // return verified;
  @Override
  public boolean isEnabled() {
    return true;
  }

  // feat/add-1-entity
  public void addWatchlist(Watchlist watchlist) {
    watchlists.add(watchlist);
    watchlist.setUser(this); // crucial ✅ Must set back-reference
  }

  public void addTrade(Trade trade) {
    trades.add(trade);
  }

  public void addPortfolio(Portfolio portfolio) {
    portfolios.add(portfolio);
    portfolio.setUser(this); // crucial ✅ Must set back-reference
  }

  // public void addConnectedAccount(UserConnectedAccount connectedAccount) {
  // connectedAccounts.add(connectedAccount);
  // }

}

// User is created either with email or oauth2 authentication.
// Oauth2/connected account not added manually but with oauth2 login if having same email.