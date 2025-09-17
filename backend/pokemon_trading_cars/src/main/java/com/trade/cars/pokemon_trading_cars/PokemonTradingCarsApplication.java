package com.trade.cars.pokemon_trading_cars;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.trade.cars.pokemon_trading_cars.service.PokemonCardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class PokemonTradingCarsApplication {

	public static void main(String[] args) {
		SpringApplication.run(PokemonTradingCarsApplication.class, args);
	}

	private static final Logger logger = LoggerFactory.getLogger(PokemonTradingCarsApplication.class);

	@Bean
	public CommandLineRunner generateAllCardsOnStartup(PokemonCardService cardService) {
		return args -> {
			cardService.generateAllCardsIfEmpty();
			logger.info("All Pokémon cards generated from PokéAPI if DB was empty.");
		};
	}
}
