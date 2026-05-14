package com.easylearn.security;

import com.easylearn.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Wrapper Spring Security autour de l'entité User.
 * Le principal dans le SecurityContext — accessible via @AuthenticationPrincipal UserPrincipal.
 * On utilise le nom de l'enum (STUDENT, TEACHER...) comme authority pour @PreAuthorize.
 */
@Getter
public class UserPrincipal implements UserDetails {

    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(user.getRole().name()));
    }

    /** Le "username" Spring Security est l'UUID de l'utilisateur (pas l'email). */
    @Override
    public String getUsername() {
        return user.getId().toString();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }
}
