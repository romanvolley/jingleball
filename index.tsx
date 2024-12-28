import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Card Components
// Card placeholder image using server API
const getCardImage = (cardType) => {
  return `/api/placeholder/100/140?text=${cardType}`;
};

const CARD_TYPES = [
  'Ace', 'King', 'Queen', 'Jack', 'Ten', 
  'Nine', 'Eight', 'Seven', 'Six', 'Five', 'Four'
];

const PLAYERS = [
  'Alice', 'Bob', 'Charlie', 'David',
  'Eve', 'Frank', 'Grace', 'Henry'
];

const CARDS_PER_TYPE = 10;

const CardGame = () => {
  const [deck, setDeck] = useState([]);
  const [playerHands, setPlayerHands] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [cardsPerPlayer, setCardsPerPlayer] = useState(5);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const newDeck = [];
    CARD_TYPES.forEach(type => {
      for (let i = 0; i < CARDS_PER_TYPE; i++) {
        newDeck.push(type);
      }
    });
    setDeck(newDeck);
  }, []);

  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const drawCards = () => {
    if (!selectedPlayer) {
      setError('Please select a player');
      return;
    }

    if (cardsPerPlayer < 1) {
      setError('Please select a valid number of cards');
      return;
    }

    if (cardsPerPlayer > deck.length) {
      setError('Not enough cards in deck');
      return;
    }

    setError('');
    const shuffledDeck = shuffle([...deck]);
    const drawnCards = shuffledDeck.slice(0, cardsPerPlayer);
    
    setPlayerHands(prev => ({
      ...prev,
      [selectedPlayer]: drawnCards
    }));
  };

  const resetGame = () => {
    setPlayerHands({});
    setError('');
    setSelectedPlayer('');
  };

  const saveToFile = () => {
    const content = Object.entries(playerHands)
      .map(([player, cards]) => `${player}: ${cards.join(', ')}`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'card_game_results.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderCard = (cardType) => {
    return (
      <div className="w-16 h-24 transform transition-transform hover:scale-110">
        <img 
          src={getCardImage(cardType)}
          alt={`${cardType} card`}
          className="w-full h-full rounded-lg shadow-md"
        />
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-2xl font-bold">Card Game</h1>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">
                  Select Player
                </label>
                <Select
                  value={selectedPlayer}
                  onValueChange={setSelectedPlayer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a player" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAYERS.map(player => (
                      <SelectItem key={player} value={player}>
                        {player}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">
                  Cards to Draw
                </label>
                <Input
                  type="number"
                  min="1"
                  value={cardsPerPlayer}
                  onChange={(e) => setCardsPerPlayer(parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <Button 
              onClick={drawCards}
              className="w-full"
            >
              Draw Cards
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {Object.keys(playerHands).length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Player Hands</h2>
            <div className="flex gap-2">
              <Button
                onClick={saveToFile}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Results
              </Button>
              <Button
                onClick={resetGame}
                variant="destructive"
              >
                Reset Game
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(playerHands).map(([player, cards]) => (
              <Card key={player} className="overflow-hidden">
                <CardHeader>
                  <h3 className="font-bold">{player}</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cards.map((card, index) => (
                      <div key={index} className="relative">
                        {renderCard(card)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-bold">Available Cards</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {CARD_TYPES.map((cardType) => (
              <div key={cardType} className="text-center">
                <div className="mb-2">{renderCard(cardType)}</div>
                <span className="text-sm font-medium">{cardType}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardGame;