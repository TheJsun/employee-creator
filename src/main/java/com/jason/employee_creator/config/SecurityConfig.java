package com.jason.employee_creator.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http)
    throws Exception {
    return http
      .authorizeHttpRequests(auth ->
        auth
          .requestMatchers("/api/auth/login")
          .permitAll()
          .anyRequest()
          .authenticated()
      )
      .cors(Customizer.withDefaults())
      // CSRF is deliberately disabled for now. NOTE this is a real exposure:
      // auth is session-cookie based and CORS sets allowCredentials(true), so
      // a third-party page can drive a logged-in admin's browser into calling
      // these endpoints. Disabling is only safe for stateless token auth.
      // The fix when this is deployed anywhere public is
      // csrf(c -> c.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
      // plus sending the XSRF-TOKEN cookie back as an X-XSRF-TOKEN header from
      // the frontend on every POST/PUT/PATCH/DELETE.
      .csrf(AbstractHttpConfigurer::disable)
      .securityContext(context ->
        context.securityContextRepository(securityContextRepository())
      )
      .exceptionHandling(ex ->
        ex.authenticationEntryPoint(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
        )
      )
      .logout(logout ->
        logout
          .logoutUrl("/api/auth/logout")
          .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler())
      )
      .build();
  }

  @Bean
  public SecurityContextRepository securityContextRepository() {
    return new HttpSessionSecurityContextRepository();
  }

  /**
   * Used by AuthController to rotate the session id on login. Normally
   * AbstractAuthenticationProcessingFilter applies this, but login happens in
   * a controller here so it has to be invoked by hand.
   */
  @Bean
  public SessionAuthenticationStrategy sessionAuthenticationStrategy() {
    return new ChangeSessionIdAuthenticationStrategy();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(
    AuthenticationConfiguration config
  ) throws Exception {
    return config.getAuthenticationManager();
  }
}
