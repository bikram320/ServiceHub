package org.example.QuestX.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "google.api")
@Data
public class GoogleApiKeyConfig {

    private String key;
}
