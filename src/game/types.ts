export interface Player {
  id: string;
  name: string;
  avatarColor: string;
  isImpostor?: boolean;
  votes?: number;
  hasVoted?: boolean;
}

export type GamePhase = 
  | 'lobby'
  | 'pass'
  | 'reveal'
  | 'lockScreen'
  | 'discussion'
  | 'voting'
  | 'results'
  | 'simpleRoundEnd';

export type GameMode = 'simple' | 'guided';

export interface GameSettings {
  gameMode: GameMode;
  impostorCount: number;
  showCategoryToImpostor: boolean;
  showHintToImpostor: boolean;
  selectedCategories: string[];
  discussionTimeSeconds: number;
  votingTimeSeconds: number;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  secretWord: string;
  secretHint: string;
  category: string;
  impostorIds: string[];
  settings: GameSettings;
  votes: Record<string, string>; // voterId -> votedForId
  roundNumber: number;
  crewWins: number;
  impostorWins: number;
}

export const AVATAR_COLORS = [
  'bg-game-yellow',
  'bg-game-blue',
  'bg-game-purple',
  'bg-game-pink',
  'bg-game-orange',
  'bg-game-teal',
  'bg-game-green',
];

export interface WordEntry {
  word: string;
  hint: string;
}

// Free categories (20 words each)
export const FREE_CATEGORIES: Record<string, WordEntry[]> = {
  'Animals': [
    { word: 'Elephant', hint: 'Mammoth' },
    { word: 'Penguin', hint: 'Seabird' },
    { word: 'Giraffe', hint: 'Tall deer' },
    { word: 'Dolphin', hint: 'Porpoise' },
    { word: 'Kangaroo', hint: 'Wallaby' },
    { word: 'Octopus', hint: 'Squid' },
    { word: 'Flamingo', hint: 'Pink crane' },
    { word: 'Lion', hint: 'Big cat' },
    { word: 'Tiger', hint: 'Striped cat' },
    { word: 'Zebra', hint: 'Striped horse' },
    { word: 'Monkey', hint: 'Ape' },
    { word: 'Bear', hint: 'Grizzly' },
    { word: 'Wolf', hint: 'Wild dog' },
    { word: 'Fox', hint: 'Cunning dog' },
    { word: 'Rabbit', hint: 'Hare' },
    { word: 'Turtle', hint: 'Tortoise' },
    { word: 'Shark', hint: 'Sea predator' },
    { word: 'Eagle', hint: 'Hawk' },
    { word: 'Owl', hint: 'Night bird' },
    { word: 'Crocodile', hint: 'Alligator' },
  ],
  'Food': [
    { word: 'Pizza', hint: 'Flatbread' },
    { word: 'Sushi', hint: 'Rice roll' },
    { word: 'Tacos', hint: 'Burrito' },
    { word: 'Burger', hint: 'Sandwich' },
    { word: 'Pasta', hint: 'Noodles' },
    { word: 'Croissant', hint: 'Pastry' },
    { word: 'Ramen', hint: 'Soup noodles' },
    { word: 'Ice Cream', hint: 'Frozen dessert' },
    { word: 'Pancakes', hint: 'Waffles' },
    { word: 'Steak', hint: 'Beef' },
    { word: 'Salad', hint: 'Greens' },
    { word: 'Soup', hint: 'Broth' },
    { word: 'Chocolate', hint: 'Cocoa treat' },
    { word: 'Donut', hint: 'Ring pastry' },
    { word: 'Popcorn', hint: 'Corn snack' },
    { word: 'Cheese', hint: 'Dairy block' },
    { word: 'Bread', hint: 'Baked dough' },
    { word: 'Cake', hint: 'Sweet dessert' },
    { word: 'Fries', hint: 'Potato sticks' },
    { word: 'Nachos', hint: 'Chips with dip' },
  ],
  'Objects': [
    { word: 'Chair', hint: 'Stool' },
    { word: 'Table', hint: 'Desk' },
    { word: 'Book', hint: 'Novel' },
    { word: 'Phone', hint: 'Device' },
    { word: 'Lamp', hint: 'Light' },
    { word: 'Clock', hint: 'Watch' },
    { word: 'Mirror', hint: 'Reflection' },
    { word: 'Umbrella', hint: 'Parasol' },
    { word: 'Scissors', hint: 'Cutter' },
    { word: 'Key', hint: 'Lock opener' },
    { word: 'Wallet', hint: 'Purse' },
    { word: 'Glasses', hint: 'Spectacles' },
    { word: 'Pillow', hint: 'Cushion' },
    { word: 'Bottle', hint: 'Container' },
    { word: 'Candle', hint: 'Wax light' },
    { word: 'Camera', hint: 'Photo device' },
    { word: 'Guitar', hint: 'String instrument' },
    { word: 'Bicycle', hint: 'Two-wheeler' },
    { word: 'Backpack', hint: 'Bag' },
    { word: 'Headphones', hint: 'Earphones' },
  ],
  'Electronics': [
    { word: 'Smartphone', hint: 'Mobile phone' },
    { word: 'Laptop', hint: 'Portable PC' },
    { word: 'Television', hint: 'Screen box' },
    { word: 'Headphones', hint: 'Audio device' },
    { word: 'Tablet', hint: 'iPad' },
    { word: 'Speaker', hint: 'Sound box' },
    { word: 'Smartwatch', hint: 'Wrist tech' },
    { word: 'Drone', hint: 'Flying camera' },
    { word: 'Console', hint: 'Gaming device' },
    { word: 'Camera', hint: 'Photo device' },
    { word: 'Microphone', hint: 'Audio input' },
    { word: 'Router', hint: 'WiFi box' },
    { word: 'Keyboard', hint: 'Typing device' },
    { word: 'Mouse', hint: 'Pointing device' },
    { word: 'Monitor', hint: 'Display screen' },
    { word: 'Printer', hint: 'Paper output' },
    { word: 'USB Drive', hint: 'Flash storage' },
    { word: 'Charger', hint: 'Power cable' },
    { word: 'Projector', hint: 'Image display' },
    { word: 'VR Headset', hint: 'Virtual reality' },
  ],
};

// PRO categories (locked)
export const PRO_CATEGORIES: Record<string, WordEntry[]> = {
  'Brands': [
    { word: 'Nike', hint: 'Sports brand' },
    { word: 'Apple', hint: 'Tech company' },
    { word: 'McDonalds', hint: 'Fast food' },
    { word: 'Coca Cola', hint: 'Soda brand' },
    { word: 'Google', hint: 'Search engine' },
    { word: 'Amazon', hint: 'Online store' },
    { word: 'Netflix', hint: 'Streaming' },
    { word: 'Disney', hint: 'Entertainment' },
    { word: 'Samsung', hint: 'Electronics' },
    { word: 'Adidas', hint: 'Sports gear' },
    { word: 'Starbucks', hint: 'Coffee chain' },
    { word: 'Tesla', hint: 'Electric cars' },
    { word: 'Microsoft', hint: 'Software' },
    { word: 'Instagram', hint: 'Photo app' },
    { word: 'YouTube', hint: 'Video platform' },
    { word: 'Spotify', hint: 'Music app' },
    { word: 'Uber', hint: 'Ride service' },
    { word: 'IKEA', hint: 'Furniture store' },
    { word: 'Lego', hint: 'Building blocks' },
    { word: 'Nintendo', hint: 'Game company' },
  ],
  'Movies': [
    { word: 'Avatar', hint: 'Blue aliens' },
    { word: 'Titanic', hint: 'Ship movie' },
    { word: 'Inception', hint: 'Dream layers' },
    { word: 'Frozen', hint: 'Ice princess' },
    { word: 'Joker', hint: 'Villain origin' },
    { word: 'Matrix', hint: 'Simulation' },
    { word: 'Shrek', hint: 'Green ogre' },
    { word: 'Avengers', hint: 'Superhero team' },
    { word: 'Jaws', hint: 'Shark attack' },
    { word: 'Jurassic Park', hint: 'Dinosaurs' },
    { word: 'Star Wars', hint: 'Space saga' },
    { word: 'Harry Potter', hint: 'Wizard boy' },
    { word: 'Lion King', hint: 'Jungle royalty' },
    { word: 'Finding Nemo', hint: 'Lost fish' },
    { word: 'Toy Story', hint: 'Living toys' },
    { word: 'Batman', hint: 'Dark knight' },
    { word: 'Spider-Man', hint: 'Web hero' },
    { word: 'Minions', hint: 'Yellow helpers' },
    { word: 'Transformers', hint: 'Robot cars' },
    { word: 'Fast & Furious', hint: 'Racing' },
  ],
  'Vehicles': [
    { word: 'Helicopter', hint: 'Chopper' },
    { word: 'Submarine', hint: 'Underwater vessel' },
    { word: 'Motorcycle', hint: 'Bike' },
    { word: 'Airplane', hint: 'Jet' },
    { word: 'Train', hint: 'Railway' },
    { word: 'Boat', hint: 'Ship' },
    { word: 'Rocket', hint: 'Spacecraft' },
    { word: 'Bus', hint: 'Coach' },
    { word: 'Taxi', hint: 'Cab' },
    { word: 'Ambulance', hint: 'Medical vehicle' },
    { word: 'Tractor', hint: 'Farm vehicle' },
    { word: 'Skateboard', hint: 'Board with wheels' },
    { word: 'Jet Ski', hint: 'Water bike' },
    { word: 'Hot Air Balloon', hint: 'Flying basket' },
    { word: 'Scooter', hint: 'Small bike' },
    { word: 'Limousine', hint: 'Long car' },
    { word: 'Fire Truck', hint: 'Emergency vehicle' },
    { word: 'Tank', hint: 'Armored vehicle' },
    { word: 'Yacht', hint: 'Luxury boat' },
    { word: 'Hoverboard', hint: 'Floating board' },
  ],
  'Superpowers': [
    { word: 'Flying', hint: 'Floating' },
    { word: 'Invisibility', hint: 'Unseen' },
    { word: 'Teleportation', hint: 'Instant travel' },
    { word: 'Super Strength', hint: 'Powerful' },
    { word: 'Mind Reading', hint: 'Telepathy' },
    { word: 'Time Travel', hint: 'Past/Future' },
    { word: 'Laser Vision', hint: 'Eye beams' },
    { word: 'Shape Shifting', hint: 'Transformation' },
    { word: 'Super Speed', hint: 'Fast runner' },
    { word: 'Telekinesis', hint: 'Move objects' },
    { word: 'Healing', hint: 'Recovery' },
    { word: 'Fire Control', hint: 'Pyrokinesis' },
    { word: 'Ice Powers', hint: 'Freezing' },
    { word: 'Elasticity', hint: 'Stretching' },
    { word: 'X-Ray Vision', hint: 'See through' },
    { word: 'Weather Control', hint: 'Storm power' },
    { word: 'Cloning', hint: 'Duplication' },
    { word: 'Force Field', hint: 'Shield' },
    { word: 'Mind Control', hint: 'Hypnosis' },
    { word: 'Night Vision', hint: 'Dark sight' },
  ],
  'Fears': [
    { word: 'Heights', hint: 'Tall places' },
    { word: 'Spiders', hint: 'Eight legs' },
    { word: 'Darkness', hint: 'No light' },
    { word: 'Snakes', hint: 'Slithering' },
    { word: 'Clowns', hint: 'Circus performer' },
    { word: 'Flying', hint: 'Airplanes' },
    { word: 'Drowning', hint: 'Water' },
    { word: 'Needles', hint: 'Injections' },
    { word: 'Ghosts', hint: 'Spirits' },
    { word: 'Thunder', hint: 'Storm sounds' },
    { word: 'Crowds', hint: 'Many people' },
    { word: 'Dogs', hint: 'Barking' },
    { word: 'Blood', hint: 'Red liquid' },
    { word: 'Confined Spaces', hint: 'Small rooms' },
    { word: 'Public Speaking', hint: 'Presentations' },
    { word: 'Failure', hint: 'Not succeeding' },
    { word: 'Loneliness', hint: 'Being alone' },
    { word: 'Death', hint: 'End of life' },
    { word: 'Zombies', hint: 'Undead' },
    { word: 'Deep Ocean', hint: 'Abyss' },
  ],
  'Inventions': [
    { word: 'Wheel', hint: 'Rolling circle' },
    { word: 'Light Bulb', hint: 'Electric light' },
    { word: 'Telephone', hint: 'Calling device' },
    { word: 'Computer', hint: 'Machine' },
    { word: 'Internet', hint: 'Network' },
    { word: 'Printing Press', hint: 'Book maker' },
    { word: 'Airplane', hint: 'Flying machine' },
    { word: 'Vaccine', hint: 'Medicine shot' },
    { word: 'Refrigerator', hint: 'Cold storage' },
    { word: 'Television', hint: 'Screen box' },
    { word: 'Camera', hint: 'Photo device' },
    { word: 'Microwave', hint: 'Quick heater' },
    { word: 'GPS', hint: 'Navigation' },
    { word: 'Smartphone', hint: 'Mobile phone' },
    { word: 'Battery', hint: 'Power source' },
    { word: 'Elevator', hint: 'Lift' },
    { word: 'Compass', hint: 'Direction finder' },
    { word: 'Telescope', hint: 'Star viewer' },
    { word: 'X-Ray', hint: 'Body scanner' },
    { word: 'Solar Panel', hint: 'Sun power' },
  ],
  'Celebrities': [
    { word: 'Taylor Swift', hint: 'Pop singer' },
    { word: 'Elon Musk', hint: 'Tech billionaire' },
    { word: 'Beyoncé', hint: 'Queen B' },
    { word: 'Cristiano Ronaldo', hint: 'Soccer star' },
    { word: 'Kim Kardashian', hint: 'Reality TV' },
    { word: 'The Rock', hint: 'Actor wrestler' },
    { word: 'Lady Gaga', hint: 'Pop icon' },
    { word: 'LeBron James', hint: 'Basketball' },
    { word: 'Oprah', hint: 'Talk show host' },
    { word: 'Drake', hint: 'Rapper' },
    { word: 'Ariana Grande', hint: 'Thank u next' },
    { word: 'Tom Hanks', hint: 'Forrest Gump' },
    { word: 'Rihanna', hint: 'Umbrella singer' },
    { word: 'Messi', hint: 'Football GOAT' },
    { word: 'Zendaya', hint: 'Euphoria star' },
    { word: 'Bad Bunny', hint: 'Reggaeton' },
    { word: 'Selena Gomez', hint: 'Disney star' },
    { word: 'Post Malone', hint: 'Tattooed singer' },
    { word: 'Shakira', hint: 'Hips singer' },
    { word: 'Chris Hemsworth', hint: 'Thor actor' },
  ],
  'Games': [
    { word: 'Minecraft', hint: 'Block building' },
    { word: 'Fortnite', hint: 'Battle royale' },
    { word: 'Mario', hint: 'Plumber' },
    { word: 'Pokemon', hint: 'Catch them' },
    { word: 'Tetris', hint: 'Falling blocks' },
    { word: 'Roblox', hint: 'Platform game' },
    { word: 'Among Us', hint: 'Impostor game' },
    { word: 'Call of Duty', hint: 'War shooter' },
    { word: 'FIFA', hint: 'Soccer game' },
    { word: 'GTA', hint: 'Crime game' },
    { word: 'Zelda', hint: 'Link adventure' },
    { word: 'Pac-Man', hint: 'Yellow circle' },
    { word: 'Sonic', hint: 'Blue hedgehog' },
    { word: 'Chess', hint: 'Strategy board' },
    { word: 'Monopoly', hint: 'Property game' },
    { word: 'Uno', hint: 'Card game' },
    { word: 'Candy Crush', hint: 'Match candies' },
    { word: 'League of Legends', hint: 'MOBA' },
    { word: 'Clash Royale', hint: 'Card battle' },
    { word: 'Wordle', hint: 'Word puzzle' },
  ],
  'Anime': [
    { word: 'Naruto', hint: 'Ninja boy' },
    { word: 'Dragon Ball', hint: 'Goku' },
    { word: 'One Piece', hint: 'Pirate king' },
    { word: 'Attack on Titan', hint: 'Giants' },
    { word: 'Demon Slayer', hint: 'Sword fighter' },
    { word: 'My Hero Academia', hint: 'Superheroes' },
    { word: 'Death Note', hint: 'Killer notebook' },
    { word: 'Sailor Moon', hint: 'Moon princess' },
    { word: 'One Punch Man', hint: 'Strong hero' },
    { word: 'Jujutsu Kaisen', hint: 'Curses' },
    { word: 'Spy x Family', hint: 'Secret agent' },
    { word: 'Bleach', hint: 'Soul reapers' },
    { word: 'Pokémon', hint: 'Pocket monsters' },
    { word: 'Totoro', hint: 'Forest spirit' },
    { word: 'Spirited Away', hint: 'Bathhouse' },
    { word: 'Fullmetal Alchemist', hint: 'Brothers' },
    { word: 'Tokyo Ghoul', hint: 'Flesh eaters' },
    { word: 'Chainsaw Man', hint: 'Devil hunter' },
    { word: 'Hunter x Hunter', hint: 'Gon' },
    { word: 'Cowboy Bebop', hint: 'Space bounty' },
  ],
  'Countries': [
    { word: 'Japan', hint: 'Land of rising sun' },
    { word: 'Brazil', hint: 'Soccer nation' },
    { word: 'Egypt', hint: 'Pyramids' },
    { word: 'Australia', hint: 'Down under' },
    { word: 'Italy', hint: 'Boot country' },
    { word: 'Canada', hint: 'Maple leaf' },
    { word: 'France', hint: 'Eiffel Tower' },
    { word: 'Germany', hint: 'Oktoberfest' },
    { word: 'Mexico', hint: 'Tacos land' },
    { word: 'India', hint: 'Taj Mahal' },
    { word: 'China', hint: 'Great Wall' },
    { word: 'Spain', hint: 'Flamenco' },
    { word: 'Greece', hint: 'Olympics origin' },
    { word: 'Thailand', hint: 'Land of smiles' },
    { word: 'Kenya', hint: 'Safari' },
    { word: 'Iceland', hint: 'Fire and ice' },
    { word: 'Switzerland', hint: 'Alps' },
    { word: 'Jamaica', hint: 'Reggae' },
    { word: 'Russia', hint: 'Largest country' },
    { word: 'South Korea', hint: 'K-pop' },
  ],
};

// All categories combined for easy access
export const ALL_CATEGORIES = { ...FREE_CATEGORIES, ...PRO_CATEGORIES };

// Get category names
export const FREE_CATEGORY_NAMES = Object.keys(FREE_CATEGORIES);
export const PRO_CATEGORY_NAMES = Object.keys(PRO_CATEGORIES);

// Calculate max impostors based on player count
export function getMaxImpostors(playerCount: number): number {
  if (playerCount <= 4) return 1;
  if (playerCount <= 6) return 2;
  if (playerCount <= 8) return 3;
  return 4; // 9-10 players
}

// Default settings
export function createDefaultSettings(): GameSettings {
  return {
    gameMode: 'guided',
    impostorCount: 1,
    showCategoryToImpostor: false,
    showHintToImpostor: false,
    selectedCategories: [...FREE_CATEGORY_NAMES], // Default to all free categories
    discussionTimeSeconds: 120,
    votingTimeSeconds: 60,
  };
}

export function createInitialState(): GameState {
  return {
    phase: 'lobby',
    players: [],
    currentPlayerIndex: 0,
    secretWord: '',
    secretHint: '',
    category: '',
    impostorIds: [],
    settings: createDefaultSettings(),
    votes: {},
    roundNumber: 0,
    crewWins: 0,
    impostorWins: 0,
  };
}

export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
