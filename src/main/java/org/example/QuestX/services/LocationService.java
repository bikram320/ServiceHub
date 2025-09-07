package org.example.QuestX.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class LocationService {


    // it will return the address in human-readable form
    public String getAddressByCoordinates(double latitude, double longitude) {
        String url = String.format(
                "https://nominatim.openstreetmap.org/reverse?lat=%s&lon=%s&format=json",
                latitude, longitude
        );
        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("display_name")) {
                return (String) response.get("display_name"); // Human-readable address
            }
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
        return null;
    }
}
