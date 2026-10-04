package com.jason.employee_creator.user;

import java.util.Locale;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public AppUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String email) {
    String normalisedEmail =
      email == null ? "" : email.trim().toLowerCase(Locale.ROOT);

    User user = userRepository
      .findByEmail(normalisedEmail)
      .orElseThrow(() ->
        new UsernameNotFoundException("No user with email " + normalisedEmail)
      );
    return new CurrentUser(user);
  }
}
