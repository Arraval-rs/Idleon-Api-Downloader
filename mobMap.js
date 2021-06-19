//maps stored mob names to their game display name
//used for naming cards
var mobMap = {
    "ForgeA" : "Fire Forge",
    "ForgeB" : "Cinder Forge",
    "Bandit_Bob" : "Bandit Bob",
    "SoulCard1" : "Forest Soul",
    "SoulCard2" : "Dune Soul",
    "SoulCard3" : "Rooted Soul",
    "SoulCard4" : "Frigid Soul",
    "SoulCard5" : "Squiddy Soul",
    "SoulCard6" : "Bandit Bob",
    "CritterCard1" : "Froge",
    "CritterCard2" : "Crabbo",
    "CritterCard3" : "Scorpie",
    "CritterCard4" : "Mousey",
    "CritterCard5" : "Owlio",
    "CritterCard6" : "Pingy",
    "CritterCard7" : "Bunny",
    "CritterCard8" : "Dung Beat",
    "CritterCard9" : "Honker",
    "Crystal0" : "Crystal Carrot",
    "Crystal1" : "Crystal Crabal",
    "Crystal2" : "Crystal Cattle",
    "mushG" : "Green Mushroom",
    "frogG" : "Frog",
    "beanG" : "Bored Bean",
    "slimeG" : "Slime",
    "snakeG" : "Baby Boa",
    "carrotO" : "Carrotman",
    "goblinG" : "Glublin",
    "plank" : "Wode Board",
    "frogBIG" : "Gigafrog",
    "branch" : "Walking Stick",
    "acorn" : "Nutto",
    "mushW" : "Wood Mushroom",
    "poopSmall" : "Poop",
    "ratB" : "Rat",
    "poopD" : "Boop",
    "rockG" : "Healing Rune",
    "rockB" : "Shielding Rune",
    "rockS" : "Skeleton Rune",
    "jarSand" : "Sandy Pot",
    "mimicA" : "Mimic",
    "crabcake" : "Crabcake",
    "coconut" : "Mafioso",
    "sandcastle" : "Sand Castle",
    "pincermin" : "Pincermin",
    "potato" : "Mashed Potato",
    "steak" : "Tyson",
    "moonman" : "Moonmoon",
    "sandgiant" : "Sand Giant",
    "snailZ" : "Snelbie",
    "sheep" : "Sheepie",
    "flake" : "Frost Flake",
    "stache" : "Sir Stache",
    "ram" : "Dedotated Ram",
    "bloque" : "Bloque",
    "mamoth" : "Mamooth",
    "snowball" : "Snowman",
    "penguin" : "Penguin",
    "thermostat" : "Thermister",
    "glass" : "Quenchie",
    "snakeB" : "Cryosnake",
    "speaker" : "Bop Box",
    "eye" : "Neyeptune",
    "mushR" : "Red Mushroom",
    "shovelR" : "Dig Doug",
    "skele" : "Xylobone",
    "skele2" : "Bloodbone",
    "wolfA" : "Amarok",
    "wolfB" : "Chaotic Amarok",
    "wolfC" : "Nightmare Amarok",
    "Boss2A" : "Efaunt",
    "Boss2B" : "Chaotic Efaunt",
    "Boss2C" : "Nightmare Amarok",
    "Boss3A" : "Chizoar",
    "Boss3B" : "Chaotic Chizoar",
    "Boss3C" : "Nightmare Chizoar",
    "poopBig" : "Dr Defecaus",
    "babayaga" : "Baba Yaga",
    "babaHour" : "Biggie Hours",
    "babaMummy" : "King Doot",
    "xmasEvent" : "Giftmas Blobulyte",
    "xmasEvent2" : "Meaning of Giftmas",
    "loveEvent" : "Loveulyte",
    "loveEvent2" : "Chocco Box",
    "EasterEvent1" : "Egggulyte",
    "EasterEvent2" : "Egg Capsule",
    "Blank0ramaFiller" : "Nightmare Amarok",
    "ghost" : "Ghost",
    "slimeR" : "Valentslime",
    "sheepB" : "Floofie",
    "snakeY" : "Shell Snake",
    "Copper" : "Copper",
    "Iron" : "Iron",
    "Gold" : "Gold",
    "Plat" : "Plat",
    "Dementia" : "Dementia",
    "Void" : "Void",
    "Lustre" : "Lustre",
    "Starfire" : "Starfire",
    "Dreadlo" : "Dreadlo",
    "Godshard" : "Godshard",
    "OakTree" : "Oak Tree",
    "BirchTree" : "Birch Tree",
    "JungleTree" : "Jungle Tree",
    "ForestTree" : "Forest Tree",
    "PalmTree" : "Palm Tree",
    "ToiletTree" : "Toilet Tree",
    "StumpTree" : "Stump Tree",
    "SaharanFoal" : "Saharan Foal",
    "Tree7" : "Wispy Tree",
    "AlienTree" : "Alien Tree",
    "FishSmall" : "Small Fish",
    "Fish1" : "Goldfish",
    "Fish2" : "Hermit Can",
    "Fish3" : "Jellyfish",
    "Fish4" : "Bloach",
    "BugNest1" : "Fly Nest",
    "BugNest2" : "Butterfly Bar",
    "BugNest3" : "Sentient Bowl",
    "BugNest4" : "Grocery Bag",
    "BugNest5" : "Snowden",
    "BugNest6" : "Icicle Nest",
    "Bug1" : "Flies",
    "Bug2" : "Butterflies",
    "Bug3" : "Sentient Cereal",
    "Bug4" : "Fruitflies",
    "Bug5" : "Mosquisnow",
    "Bug6" : "Flycicle",
    "BossPart" : "Error",
    "EfauntArm" : "Error",
    "ChestA1" : "Bronze Chest",
    "ChestB1" : "Silver Chest",
    "ChestC1" : "Golden Chest",
    "ChestD1" : "Legendary Chest",
    "ChestA2" : "Bronze Chest",
    "ChestB2" : "Silver Chest",
    "ChestC2" : "Golden Chest",
    "ChestD2" : "Legendary Chest",
    "ChestA3" : "Bronze Chest",
    "ChestB3" : "Silver Chest",
    "ChestC3" : "Golden Chest",
    "ChestD3" : "Legendary Chest",
    "ChestA4" : "Bronze Chest",
    "ChestB4" : "Silver Chest",
    "ChestC4" : "Golden Chest",
    "ChestD4" : "Legendary Chest",
    "ChestA5" : "Bronze Chest",
    "ChestB5" : "Silver Chest",
    "ChestC5" : "Golden Chest",
    "ChestD5" : "Legendary Chest",
    "ChestA6" : "Bronze Chest",
    "ChestB6" : "Silver Chest",
    "ChestC6" : "Golden Chest",
    "ChestD6" : "Legendary Chest",
    "ChestA7" : "Bronze Chest",
    "ChestB7" : "Silver Chest",
    "ChestC7" : "Golden Chest",
    "ChestD7" : "Legendary Chest",
    "ChestA8" : "Bronze Chest",
    "ChestB8" : "Silver Chest",
    "ChestC8" : "Golden Chest",
    "ChestD8" : "Legendary Chest",
    "mushPtutorial" : "Error",
    "demonPtutorial" : "Error",
    "AlienTreetutorial" : "Error",
    "Starlight" : "Error",
    "behemoth" : "Error"
}