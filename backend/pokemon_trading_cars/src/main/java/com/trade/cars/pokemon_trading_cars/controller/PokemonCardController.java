package com.trade.cars.pokemon_trading_cars.controller;

import com.trade.cars.pokemon_trading_cars.model.PokemonCard;
import com.trade.cars.pokemon_trading_cars.service.PokemonCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*")
public class PokemonCardController {

    private final PokemonCardService service;

    public PokemonCardController(PokemonCardService service) {
        this.service = service;
    }

    @GetMapping
    public List<PokemonCard> getAllCards() {
        return service.getAllCards();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PokemonCard> getCardById(@PathVariable Long id) {
        Optional<PokemonCard> card = service.getCardById(id);
        return card.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public PokemonCard createCard(@RequestBody PokemonCard card) {
        return service.saveCard(card);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PokemonCard> updateCard(@PathVariable Long id, @RequestBody PokemonCard card) {
        if (!service.getCardById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        card.setId(id);
        return ResponseEntity.ok(service.saveCard(card));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        if (!service.getCardById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteCard(id);
        return ResponseEntity.noContent().build();
    }

    // AI: Generate and save all Pokemon cards
    @PostMapping("/ai")
    public List<PokemonCard> generateAllCards() {
        return service.generateAllCards();
    }
}