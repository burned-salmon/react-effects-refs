import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    // this is called after component is first added to DOM
    useEffect(function getNewDeck() {
        async function fetchDeck() {
            const deckResult = await axios.get(`${BASE_URL}/new/shuffle`);
            setDeck(deckResult.data);
        }
        fetchDeck();
    }, []);

    async function draw() {
        try {
            const drawResponse = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/`);

            if (drawResponse.data.remaining === 0) throw new Error("Deck empty!");

            const card = drawResponse.data.cards[0];

            setDrawn(d => [
                ...d,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,
                },
            ]);
        } catch (err) {
            alert(err);
        }
    };

    async function shuffle() {
        setIsShuffling(true);
        try {
            await axios.get(`${BASE_URL}/${deck.deck_id}/shuffle/`);
            setDrawn([]);
        } catch (err) {
            alert(err);
        } finally {
            setIsShuffling(false);
        }
    }

    function safeRenderDrawButton() {
        if (!deck) return null;

        return (
            <button
                className="Deck-gimme"
                onClick={draw}
                disabled={isShuffling}>
                DRAW
            </button>
        );
    }

    function safeRenderShuffleButton() {
        if (!deck) return null;
        return (
            <button
                className="Deck-gimme"
                onClick={shuffle}
                disabled={isShuffling}>
                SHUFFLE DECK
            </button>
        );
    }

    return (
        <main className="Deck">

            {safeRenderDrawButton()}
            {safeRenderShuffleButton()}

            <div>{
                drawn.map(c => (
                    <img src={c.image} />
                ))}
            </div>

        </main>
    );
};

export default Deck;
