function fetchMonsterData(monster) {
  let url = monster.url;
  fetch(url)
    .then((response) => response.json())
    .then(function (chosen) {
      renderMonster(chosen);
    });
}

function toTitleCase(str) {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

function acquireAbilities(chosen) {
  let pokenAbleTd = document.createElement("td");

  let abilityUl = document.createElement("ul");
  pokenAbleTd.innerHTML = "<strong>&nbsp;Abilities</strong>";
  pokenAbleTd.className = "abilityFacts";
  abilityUl.classList.add("small");

  var abilities = [];
  abilities = chosen.abilities;
  for (let index = 0; index < abilities.length; index++) {
    const element = abilities[index];
    for (const key in element) {
      if (Object.hasOwnProperty.call(element, key)) {
        const item = element[key];
        if (key == "ability") {
          let abilityLi = document.createElement("li");
          abilityLi.innerText = item.name;
          abilityUl.append(abilityLi);
        }
      }
    }
  }
  pokenAbleTd.append(abilityUl);
  return pokenAbleTd;
}
// To create the card with pokemon image with the name
async function createImage(ID, pokeBallDiv, name) {
  let pokeBall = document.createElement("tr");
  pokeBall.classList.add("image");
  let pokenPhoto = document.createElement("img");
  pokenPhoto.srcset = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ID}.png`;
  pokenPhoto.alt = `${name}`;
  pokeBall.append(pokenPhoto);
  let pokemon = document.createElement("h2");
  pokemon.innerText = toTitleCase(name);
  pokeBall.append(pokemon);
  pokeBallDiv.append(pokeBall);
}

//To tag weights
let badgeWeights = function (weights) {
  let weightRow = document.createElement("tr");
  weightRow.classList.add("weights");
  let weightBadge = document.createElement("span");
  //add the weights using W3C Badges
  weightBadge.classList.add("w3-badge");
  weightBadge.classList.add("w3-tiny");
  weightBadge.classList.add("w3-right");
  weightBadge.classList.add("w3-margin-right");
  if (weights < 50) {
    weightBadge.classList.add("w3-yellow");
  } else if (weights < 75 && weights >= 50) {
    weightBadge.classList.add("w3-green");
  } else if (weights < 100 && weights >= 75) {
    weightBadge.classList.add("w3-red");
  } else if (weights < 200 && weights >= 100) {
    weightBadge.classList.add("w3-dark-grey");
  } else if (weights < 300 && weights >= 200) {
    weightBadge.classList.add("w3-brown");
  } else if (weights < 400 && weights >= 300) {
    weightBadge.classList.add("w3-light-grey");
  } else if (weights >= 400) {
    weightBadge.classList.add("w3-amber");
  } else {
    weightBadge.classList.add("w3-pale-green");
  }
  weightBadge.innerHTML = weights;
  weightRow.appendChild(weightBadge);
  return weightRow;
};
async function renderMonster(chosen) {
  let basket = document.getElementById("features");
  let pokeBall = document.createElement("div");
  //create the cards
  pokeBall.classList.add("cards");
  //add weights
  let weights = chosen.weight;
  pokeBall.appendChild(badgeWeights(weights));
  let pokenCharsRow = document.createElement("tr");
  pokenCharsRow.classList.add("spreadOut");
  //add the abilities & capture the moves as TDs!
  pokenCharsRow.append(acquireAbilities(chosen), captureTop5Moves(chosen));
  //Try Capturing the images for all the 50 pokemon
  try {
    let imagesAcquired = createImage(chosen.id, pokeBall, chosen.name);
    imagesAcquired.then(console.log("cards images acquired"));
  } catch (error) {
    console.log(error);
  }
  pokeBall.append(pokenCharsRow);
  basket.appendChild(pokeBall);
}
//Restrict move capturing to 5 as some have extensive moves learnt
function captureTop5Moves(chosen) {
  let pokenMovesTd = document.createElement("td");
  let movesUl = document.createElement("ul");
  pokenMovesTd.innerHTML = "<strong>Moves&nbsp;</strong>";
  pokenMovesTd.className = "moveFacts";
  movesUl.classList.add("movesLi");
  var moves = [];
  moves = chosen.moves;
  for (let index = 0; index < moves.length; index++) {
    const element = moves[index];
    for (const key in element) {
      if (Object.hasOwnProperty.call(element, key)) {
        const item = element[key];
        if (key == "move" && index < 5) {
          // restricting to just 5 first of the list moves
          let moveLi = document.createElement("li");
          moveLi.innerText = item.name;
          movesUl.append(moveLi);
        }
      }
    }
  }
  pokenMovesTd.append(movesUl);
  return pokenMovesTd;
}

( function () {
  let pokeBalls = document.querySelector("#features");
  fetch("https://pokeapi.co/api/v2/pokemon?limit=50")
    .then((response) => response.json())
    .then(function (pokemons) {
      pokemons.results.forEach(function (pokemon) {
        fetchMonsterData(pokemon);
      });
    });
})();