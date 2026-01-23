package com.example.backend;

import net.minidev.json.JSONUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.core.env.Environment;;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class BackendApplication {
	@Value("${app.database.username}")
	public static String url;
	public static String test1 = "hello world";
	public static void main(String[] args) {
//		SpringApplication.run(BackendApplication.class, args);
		ConfigurableApplicationContext context = SpringApplication.run(BackendApplication.class, args);

		Environment env = context.getEnvironment();

		System.out.println("✅ spring.datasource.url: " + env.getProperty("spring.datasource.url"));
		System.out.println("✅ app.database.username: " + env.getProperty("app.database.username"));
		System.out.println("test1: " + test1);
	}

}
