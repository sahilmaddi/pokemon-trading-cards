package com.trade.cars.pokemon_trading_cars.service;

import com.trade.cars.pokemon_trading_cars.model.PokemonCard;
import com.trade.cars.pokemon_trading_cars.repository.PokemonCardRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;

import java.util.List;
import java.util.Optional;

@Service
public class PokemonCardService {

    private final PokemonCardRepository repository;

    public PokemonCardService(PokemonCardRepository repository) {
        this.repository = repository;
    }

    public List<PokemonCard> getAllCards() {
        return repository.findAll();
    }

    public Optional<PokemonCard> getCardById(Long id) {
        return repository.findById(id);
    }

    public PokemonCard saveCard(PokemonCard card) {
        return repository.save(card);
    }

    public void deleteCard(Long id) {
        repository.deleteById(id);
    }


    // AI: Generate and save all Pokemon cards from PokéAPI (all generations)
    public List<PokemonCard> generateAllCards() {
        repository.deleteAll();
        List<PokemonCard> allCards = new ArrayList<>();
        RestTemplate restTemplate = new RestTemplate();
        for (int gen = 1; gen <= 9; gen++) {
            List<PokemonCard> genCards = fetchGenerationCards(restTemplate, gen);
            allCards.addAll(genCards);
        }
        return repository.saveAll(allCards);
    }

    // Only generate if empty (for startup)
    public void generateAllCardsIfEmpty() {
        if (repository.count() == 0) {
            generateAllCards();
        }
    }

    private List<PokemonCard> fetchGenerationCards(RestTemplate restTemplate, int gen) {
        List<PokemonCard> cards = new ArrayList<>();
        String genUrl = "https://pokeapi.co/api/v2/generation/" + gen;
        Object genDataObj = restTemplate.getForObject(genUrl, java.util.Map.class);
        if (!(genDataObj instanceof java.util.Map)) return cards;
        java.util.Map<?,?> genData = (java.util.Map<?,?>) genDataObj;
        Object speciesListObj = genData.get("pokemon_species");
        if (!(speciesListObj instanceof java.util.List)) return cards;
        java.util.List<?> speciesList = (java.util.List<?>) speciesListObj;
        for (Object speciesObj : speciesList) {
            if (!(speciesObj instanceof java.util.Map)) continue;
            java.util.Map<?,?> species = (java.util.Map<?,?>) speciesObj;
            String name = (String) species.get("name");
            PokemonCard card = fetchPokemonCard(restTemplate, name, gen);
            if (card != null) cards.add(card);
        }
        return cards;
    }

    private PokemonCard fetchPokemonCard(RestTemplate restTemplate, String name, int gen) {
        String pokeUrl = "https://pokeapi.co/api/v2/pokemon/" + name;
        try {
            Object pokeDataObj = restTemplate.getForObject(pokeUrl, java.util.Map.class);
            if (!(pokeDataObj instanceof java.util.Map)) return null;
            java.util.Map<?,?> pokeData = (java.util.Map<?,?>) pokeDataObj;
            // Type
            String type = "Unknown";
            Object typesObj = pokeData.get("types");
            if (typesObj instanceof java.util.List && !((java.util.List<?>) typesObj).isEmpty()) {
                Object first = ((java.util.List<?>) typesObj).get(0);
                if (first instanceof java.util.Map) {
                    Object typeInfoObj = ((java.util.Map<?,?>) first).get("type");
                    if (typeInfoObj instanceof java.util.Map) {
                        java.util.Map<?,?> typeMap = (java.util.Map<?,?>) typeInfoObj;
                        Object typeName = typeMap.get("name");
                        if (typeName instanceof String) type = (String) typeName;
                    }
                }
            }
            // HP
            int hp = 50;
            Object statsObj = pokeData.get("stats");
            if (statsObj instanceof java.util.List) {
                java.util.List<?> statsList = (java.util.List<?>) statsObj;
                for (Object statObj : statsList) {
                    if (!(statObj instanceof java.util.Map)) continue;
                    java.util.Map<?,?> stat = (java.util.Map<?,?>) statObj;
                    Object statInfoObj = stat.get("stat");
                    if (statInfoObj instanceof java.util.Map) {
                        java.util.Map<?,?> statInfo = (java.util.Map<?,?>) statInfoObj;
                        Object statName = statInfo.get("name");
                        if ("hp".equals(statName)) {
                            Object baseStat = stat.get("base_stat");
                            if (baseStat instanceof Integer) hp = (Integer) baseStat;
                            else if (baseStat instanceof Number) hp = ((Number) baseStat).intValue();
                            break;
                        }
                    }
                }
            }
            // Image
            String imageUrl = null;
            Object spritesObj = pokeData.get("sprites");
            if (spritesObj instanceof java.util.Map) {
                java.util.Map<?,?> spritesMap = (java.util.Map<?,?>) spritesObj;
                Object img = spritesMap.get("front_default");
                if (img instanceof String) imageUrl = (String) img;
            }
            // Rarity
            String rarity;
            if (hp > 100) rarity = "Legendary";
            else if (hp > 70) rarity = "Rare";
            else rarity = "Common";
            // Save card
            PokemonCard card = new PokemonCard();
            card.setName(capitalize(name));
            card.setType(capitalize(type));
            card.setHp(hp);
            card.setRarity(rarity);
            card.setGeneration("Gen " + gen);
            card.setImageUrl(imageUrl);
            return card;
        } catch (Exception e) {
            return null;
        }
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }


}