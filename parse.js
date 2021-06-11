//parses a raw json string of idleon save data and returns a json object that is much more usable
function parseData(data){
    var r = {};
    var jsonData = JSON.parse(data);
    var fields = jsonData.data.saveData.documentChange.document.fields;
    var charNameData = jsonData.data.charNameData;

    //create each character based on blank template
    var numChars = getNumCharacters(fields);
    var characters = [];
    for(var i = 0; i < numChars; i++) {
        var newCharacter = JSON.parse(JSON.stringify(templateData.characters)); //easy way of cloning
        newCharacter.name = charNameData[i];
        characters.push(newCharacter);
    }
    r.characters = fillCharacterData(characters, numChars, fields);

    //account data
    var account = templateData.account;

    account.chestBank = fields.MoneyBANK.doubleValue;

    //chest
    var chestOrder = fields.ChestOrder.arrayValue.values;
    var chestQuantity = fields.ChestQuantity.arrayValue.values;
    account.chest = condenseTwoRawArrays(chestOrder, chestQuantity, "item", "count", itemMap, null);

    //obols
    var obolsEquipped = fields.ObolEqO1.arrayValue.values;
    account.obols = condenseRawArray(obolsEquipped);
    
    //tasks (TODO add question mark, explained in discord)
    //TaskZZ0 = Current milestone in uncompleted task
    //TaskZZ1 = Completed Task Count
    //TaskZZ2 = merit shop purchases
    //TaskZZ3 = crafts unlocked
    //TaskZZ4 = ?
    //TaskZZ5 = ? 
    var taskData = templateData.account.tasks;
    //unlocked
    var ZZ1 = JSON.parse(fields.TaskZZ1.stringValue);
    taskData.unlocked.world1 = ZZ1[0];
    taskData.unlocked.world2 = ZZ1[1];
    taskData.unlocked.world3 = ZZ1[2];
    //milestoneProgress
    var ZZ0 = JSON.parse(fields.TaskZZ0.stringValue);
    taskData.milestoneProgress.world1 = ZZ0[0];
    taskData.milestoneProgress.world2 = ZZ0[1];
    taskData.milestoneProgress.world3 = ZZ0[2];
    //meritsOwned
    var ZZ2 = JSON.parse(fields.TaskZZ3.stringValue);
    taskData.meritsOwned.world1 = ZZ2[0];
    taskData.meritsOwned.world2 = ZZ2[1];
    taskData.meritsOwned.world3 = ZZ2[2];
    //craftsUnlocked
    var ZZ3 = JSON.parse(fields.TaskZZ3.stringValue);
    taskData.craftsUnlocked.world1 = ZZ3[0];
    taskData.craftsUnlocked.world2 = ZZ3[1];
    taskData.craftsUnlocked.world3 = ZZ3[2];
    account.tasks = taskData;

    //stamps
    var stampData = templateData.account.stamps;
    //combat
    var combatRaw = fields.StampLv.arrayValue.values[0].mapValue.fields;
    stampData.combat = condenseRawArray(combatRaw);
    //skills
    var skillsRaw = fields.StampLv.arrayValue.values[1].mapValue.fields;
    stampData.skills = condenseRawArray(skillsRaw);
    //misc
    var miscRaw = fields.StampLv.arrayValue.values[2].mapValue.fields;
    stampData.misc = condenseRawArray(miscRaw);
    account.stamps = stampData;

    //forge
    var forgeLevelRaw = fields.ForgeLV.arrayValue.values;
    account.forge.level = condenseRawArray(forgeLevelRaw);

    //alchemy
    var alchemyData = fields.CauldronInfo.arrayValue.values;
    account.alchemy.bubbleLevels.power = condenseRawArray(alchemyData[0].mapValue.fields);
    account.alchemy.bubbleLevels.quick = condenseRawArray(alchemyData[1].mapValue.fields);
    account.alchemy.bubbleLevels.highIq = condenseRawArray(alchemyData[2].mapValue.fields);
    account.alchemy.bubbleLevels.kazam = condenseRawArray(alchemyData[3].mapValue.fields);
    account.alchemy.vialLevels = condenseRawArray(alchemyData[4].mapValue.fields);

    //highest class data
    account.highestClasses = findHighestOfEachClass(r.characters);

    //guild
    account.guild.bonuses = JSON.parse(fields.Guild.stringValue)[0];

    //minigame high scores
    /*
    mining = 39
    fishing = 17
    catching = 88
    chopping = 112
    */
    /*
    0 = chopping
    1 = fishing
    2 = catching
    3 = mining
    */
    account.minigameHighscores.chopping = fields.FamValMinigameHiscores.arrayValue.values[0].integerValue;
    account.minigameHighscores.fishing = fields.FamValMinigameHiscores.arrayValue.values[1].integerValue;
    account.minigameHighscores.catching = fields.FamValMinigameHiscores.arrayValue.values[2].integerValue;
    account.minigameHighscores.mining = fields.FamValMinigameHiscores.arrayValue.values[3].integerValue;

    //highest item counts
    //copper ore = "Copper"
    //oak log = "OakTree"
    //leaf = "Leaf1"
    account.highestItemCounts.copperOre = findHighestInStorage(account.chest, "Copper Ore");
    account.highestItemCounts.oakLogs = findHighestInStorage(account.chest, "Oak Logs");
    account.highestItemCounts.grassLeaf = findHighestInStorage(account.chest, "Grass Leaf");

    //cards
    var rawCardsData = JSON.parse(fields.Cards0.stringValue);
    var cleanCardData = {};
    var cardKeys = Object.keys(rawCardsData);
    for(var i = 0; i < cardKeys.length; i++){
        var key = cardKeys[i];
        var lookup = mobMap[key];
        var count = rawCardsData[key]

        cleanCardData[lookup] = {"collected" : count, "starLevel" : getStarLevelFromCard(key, count)};
    }
    account.cards = cleanCardData;

    r.account = account;
    return r;
}

function getStarLevelFromCard(cardName, cardLevel) {
    var list = cardLevelMap[cardName];
    if(parseInt(cardLevel) >= list[2]){
        return "3 Star";
    }else if(parseInt(cardLevel) >= list[1]){
        return "2 Star";
    }else if(parseInt(cardLevel) >= list[1]){
        return "1 Star";
    }else{
        return "Acquired";
    }
}

//get number of characters that the player has unlocked
function getNumCharacters(fields) {
    var r = 0;
    var maxCharCount = 9; //TODO add constant for this
    var fieldName = "CharSAVED_"; 
    for(var i = 0; i < maxCharCount && fields[fieldName + i.toString()]["doubleValue"] != 0; i++){
        r++;
    }
    return r;
}

function findHighestInStorage(chestData, itemName) {
    var max = 0;
    for(var i = 0; i < chestData.length; i++){
        var object = chestData[i];
        if(object.item == itemName && parseInt(object.count) > max){
            max = parseInt(object.count);
        }
    }
    return max;
}

function findHighestOfEachClass(characters) {
    //create base map of characters
    var baseCharacters = [];
    for(var i = 0; i < characters.length; i++){
        var charClass = parseInt(characters[i].class);
        var charLevel = parseInt(characters[i].level);
        baseCharacters.push({
            [charClass] : charLevel 
        });
        var baseChar = charSubclassMap[charClass];
        if(baseChar != null){
            baseCharacters.push({
                [baseChar] : charLevel
            });
        }
    }

    var map = new Map();
    var uniqueClasses = [];
    for(var i = 0; i < baseCharacters.length; i++){
        var charClass = Object.keys(baseCharacters[i])[0];
        var charLevel = baseCharacters[i][charClass];
        if(map.has(charClass)){
            map.get(charClass).push(charLevel);
        }else{
            //create new
            var arr = [];
            arr.push(charLevel);
            map.set(charClass, arr);
            uniqueClasses.push(charClass);
        }
    }

    //go through the map and pick the highest value, adding it to r
    var r = {};
    for(var i = 0; i < uniqueClasses.length; i++){
        var addClass = uniqueClasses[i];
        var addLevel = Math.max(...map.get(addClass));
        r[addClass] = addLevel;
    }

    return r;
}

//grabs information from fields and inserts it into characters and returns the filled out characters
//only fills out information based on numChars given
function fillCharacterData(characters, numChars, fields) {
    for(var i = 0; i < numChars; i++) {
        characters[i].class = getAnyFieldValue(fields["CharacterClass_" + i]);
        characters[i].money = fields["Money_" + i].integerValue;
        characters[i].AFKtarget = fields["AFKtarget_" + i].stringValue;
        characters[i].attackLoadout = JSON.parse(fields["AttackLoadout_" + i].stringValue);
        characters[i].cardSetEquip = fields["CSetEq_" + i].stringValue;
        characters[i].currentMap = fields["CurrentMap_" + i].integerValue;
        characters[i].invBagsUsed = JSON.parse(fields["InvBagsUsed_" + i].stringValue);
        characters[i].npcDialogue = JSON.parse(fields["NPCdialogue_" + i].stringValue);
        characters[i].obolsEquip = fields["ObolEqO0_" + i].arrayValue.values;
        characters[i].timeAway = fields["PTimeAway_" + i].doubleValue;
        characters[i].strength = fields["PVStatList_" + i].arrayValue.values[0].integerValue;
        characters[i].agility = fields["PVStatList_" + i].arrayValue.values[1].integerValue;
        characters[i].wisdom = fields["PVStatList_" + i].arrayValue.values[2].integerValue;
        characters[i].luck = fields["PVStatList_" + i].arrayValue.values[3].integerValue;
        characters[i].level  = fields["PVStatList_" + i].arrayValue.values[4].integerValue;
        characters[i].POBoxUpgrades = JSON.parse(fields["POu_" + i].stringValue);
        characters[i].talentLevels = JSON.parse(fields["SL_" + i].stringValue);

        //inventory
        var inventoryItemNames = fields["InventoryOrder_" + i].arrayValue.values;
        var inventoryItemCounts = fields["ItemQTY_" + i].arrayValue.values;
        characters[i].inventory = condenseTwoRawArrays(inventoryItemNames, inventoryItemCounts, "name", "count");

        //equipment (0 = armor, 1 = tools, 2 = food)
        var equipableNames = fields["EquipOrder_" + i].arrayValue.values;
        var equipableCounts = fields["EquipQTY_" + i].arrayValue.values;
        
        var rawEquipmentNames = equipableNames[0].mapValue.fields;
        var rawEquipmentCounts = equipableCounts[0].mapValue.fields;
        characters[i].equipment = condenseTwoRawArrays(rawEquipmentNames, rawEquipmentCounts, "name", "count");

        var rawToolNames = equipableNames[1].mapValue.fields;
        var rawToolValues = equipableCounts[1].mapValue.fields;
        characters[i].tools = condenseTwoRawArrays(rawToolNames, rawToolValues, "name", "count");

        var rawFoodNames = equipableNames[2].mapValue.fields;
        var rawFoodCounts = equipableCounts[2].mapValue.fields;
        characters[i].food = condenseTwoRawArrays(rawFoodNames, rawFoodCounts, "name", "count");

        //statues
        var statueArray = JSON.parse(fields["StatueLevels_" + i].stringValue);
        var statueItems = [];
        for(var j = 0; j < statueArray.length; j++){
            statueItems.push({
                "level" : statueArray[j][0],
                "progress" : statueArray[j][1] 
            });
        }
        characters[i].statueLevels = statueItems;

        //cards
        var cardsArray = fields["CardEquip_" + i].arrayValue.values;
        characters[i].cardsEquip = condenseRawArray(cardsArray);

        //skill levels
        var rawSkillLevels = fields["Lv0_" + i].arrayValue.values;
        characters[i].skillLevels = condenseRawArray(rawSkillLevels);

        //star signs
        var rawStarSignData = fields["PVtStarSign_" + i].stringValue;
        var starSignSplit = rawStarSignData.split(",");
        for(var j = 0; j < starSignSplit.length; j++){
            starSignSplit[j] = starSignSplit[j].replace(/_/,"-1");
            if(starSignSplit[j] == ""){
                starSignSplit[j] = "-1";
            }
        }
        var starSignFinal = [starSignSplit[0], starSignSplit[1]];
        characters[i].starSigns = starSignFinal;

        //fishing toolkit
        characters[i].fishingToolkitEquipped.bait = fields["PVFishingToolkit_" + i].arrayValue.values[0].integerValue;
        characters[i].fishingToolkitEquipped.lure = fields["PVFishingToolkit_" + i].arrayValue.values[1].integerValue;

    }

    return characters;
} 

function condenseTwoRawArrays(raw1, raw2, field1, field2, map1, map2) {
    var r = [];
    var length = raw1.length.integerValue;
    if(length == undefined){
        length = raw1.length;
    }
    for(var i = 0; i < length; i++){
        var element1 = raw1[i];
        var element2 = raw2[i];
        var val1 = element1[Object.keys(element1)[0]];
        var val2 = element2[Object.keys(element2)[0]]
        if(map1 != null || map1 != undefined){
            val1 = map1[val1];
        }
        if(map2 != null || map2 != undefined){
            val2 = map2[val2];
        }
        r.push({
            [field1] : val1,
            [field2] : val2
        });
    }
    return r;
}

function condenseRawArray(rawArray){
    var r = [];
    var length = rawArray.length.integerValue;
    if(length == undefined){
        length = rawArray.length;
    }
    for(var i = 0; i < length; i++){
        var element = rawArray[i];
        r.push(element[Object.keys(element)[0]]);
    }
    return r;
}

//gets the first value of a given field
function getAnyFieldValue(field){
    return String(field[Object.keys(field)[0]]);
}