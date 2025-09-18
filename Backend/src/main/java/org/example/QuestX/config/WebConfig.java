package org.example.QuestX.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map URL path /upload/** to the actual file location on disk
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:Backend/upload/");
    }
}