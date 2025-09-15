package org.example.coursemanager.security;

import org.example.coursemanager.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;


public class CustomUserDetails implements UserDetails {
    private final Long id;
    private final String name;   // nálad ez a username
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user, Collection<? extends GrantedAuthority> authorities) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.authorities = authorities;
    }

    public boolean hasRole(String role) {
        return authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }


    @Override public String getUsername() { return name; }
    @Override public String getPassword() { return password; }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

}
