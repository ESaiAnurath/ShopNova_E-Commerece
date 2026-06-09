package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String fullName;

    @Column(nullable = false, length = 10)
    private String phoneNumber;

    @Column(nullable = false, length = 200)
    private String address;

    @Column(nullable = false, length = 50)
    private String city;

    @Column(nullable = false, length = 50)
    private String state;

    @Column(nullable = false, length = 6)
    private String pinCode;

    @Column(nullable = false, length = 50)
    private String country;

    @Column(length = 50)
    private String landmark;

    @Column(nullable = false)
    private boolean isDefault = false;

    @Enumerated(EnumType.STRING)
    private AddressType addressType = AddressType.RESIDENTIAL;

    public enum AddressType {
        RESIDENTIAL, COMMERCIAL
    }
}
