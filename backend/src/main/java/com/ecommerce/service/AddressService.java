package com.ecommerce.service;

import com.ecommerce.model.Address;
import com.ecommerce.model.User;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Transactional
    public Address createAddress(Long userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        address.setUser(user);

        // If it's the first address or marked as default, set it as default
        List<Address> userAddresses = addressRepository.findByUserId(userId);
        if (userAddresses.isEmpty() || address.isDefault()) {
            // Unset other default addresses
            userAddresses.forEach(a -> a.setDefault(false));
            addressRepository.saveAll(userAddresses);
            address.setDefault(true);
        }

        return addressRepository.save(address);
    }

    @Transactional(readOnly = true)
    public Address getAddressById(Long addressId) {
        return addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
    }

    @Transactional(readOnly = true)
    public List<Address> getUserAddresses(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return addressRepository.findByUserId(userId);
    }

    @Transactional
    public Address updateAddress(Long addressId, Address addressDetails) {
        Address address = getAddressById(addressId);

        if (addressDetails.getFullName() != null) address.setFullName(addressDetails.getFullName());
        if (addressDetails.getPhoneNumber() != null) address.setPhoneNumber(addressDetails.getPhoneNumber());
        if (addressDetails.getAddress() != null) address.setAddress(addressDetails.getAddress());
        if (addressDetails.getCity() != null) address.setCity(addressDetails.getCity());
        if (addressDetails.getState() != null) address.setState(addressDetails.getState());
        if (addressDetails.getPinCode() != null) address.setPinCode(addressDetails.getPinCode());
        if (addressDetails.getCountry() != null) address.setCountry(addressDetails.getCountry());
        if (addressDetails.getLandmark() != null) address.setLandmark(addressDetails.getLandmark());

        if (addressDetails.isDefault()) {
            // Unset other default addresses
            List<Address> userAddresses = addressRepository.findByUserId(address.getUser().getId());
            userAddresses.forEach(a -> a.setDefault(false));
            addressRepository.saveAll(userAddresses);
            address.setDefault(true);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(Long addressId) {
        Address address = getAddressById(addressId);

        if (address.isDefault()) {
            List<Address> userAddresses = addressRepository.findByUserId(address.getUser().getId());
            if (userAddresses.size() > 1) {
                // Set another address as default
                userAddresses.stream()
                        .filter(a -> !a.getId().equals(addressId))
                        .findFirst()
                        .ifPresent(a -> {
                            a.setDefault(true);
                            addressRepository.save(a);
                        });
            }
        }

        addressRepository.delete(address);
    }

    @Transactional(readOnly = true)
    public Address getDefaultAddress(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .orElseThrow(() -> new RuntimeException("No default address found"));
    }

    @Transactional
    public void setDefaultAddress(Long userId, Long addressId) {
        Address address = getAddressById(addressId);

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Address does not belong to this user");
        }

        // Unset other default addresses
        List<Address> userAddresses = addressRepository.findByUserId(userId);
        userAddresses.forEach(a -> a.setDefault(false));
        addressRepository.saveAll(userAddresses);

        // Set this address as default
        address.setDefault(true);
        addressRepository.save(address);
    }
}
