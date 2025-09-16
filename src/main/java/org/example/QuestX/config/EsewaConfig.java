package org.example.QuestX.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "esewa")
@Data
public class EsewaConfig {
    private String merchantId;
    private String secretKey;
    private String successUrl;
    private String failureUrl;
    private String verificationUrl;
    private String paymentUrl;
}
