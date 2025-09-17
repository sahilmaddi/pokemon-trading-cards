package com.trade.cars.pokemon_trading_cars.repository;

import com.trade.cars.pokemon_trading_cars.model.PokemonCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PokemonCardRepository extends JpaRepository<PokemonCard, Long> {
}