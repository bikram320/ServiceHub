package org.example.QuestX.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map URL path /upload/** to your actual QuestXDataFolder location
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:D:/ServiceHub/QuestXDataFolder/upload/");

        // Alternative: Use relative path (if QuestXDataFolder is at project root)
        // registry.addResourceHandler("/upload/**")
        //         .addResourceLocations("file:../QuestXDataFolder/upload/");
    }
}