package org.example.QuestX.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class LocationService {

    public double[] getCoordinatesFromAddress(String address) {
        String url = String.format(
                "https://nominatim.openstreetmap.org/search?q=%s&format=json&limit=1",
                address.replace(" ", "%20") // URL encode spaces
        );

        try {
            RestTemplate restTemplate = new RestTemplate();
            List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);

            if (response != null && !response.isEmpty()) {
                Map<String, Object> firstResult = response.get(0);
                double lat = Double.parseDouble((String) firstResult.get("lat"));
                double lon = Double.parseDouble((String) firstResult.get("lon"));
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            throw new RuntimeException("Unable to get coordinates: " + e.getMessage());
        }
        return null;
    }

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
