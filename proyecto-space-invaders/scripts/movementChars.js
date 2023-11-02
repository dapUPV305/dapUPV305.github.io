function playerspaceShipMovement() {
	if (Key.isDown(Key.L)) {
		if (spaceship.position.y < fieldHeight * 0.45) {
			spaceshipDirY = spaceShipSpeed * 0.9;
		}

		else {
			spaceshipDirY = 0;
		}
	}
	else if (Key.isDown(Key.R)) {
		if (spaceship.position.y > -fieldHeight * 0.45) {
			spaceshipDirY = -spaceShipSpeed * 0.9;
		}

		else {
			spaceshipDirY = 0;
		}
	}
	else {
		spaceshipDirY = 0;
	}

	spaceship.position.y += spaceshipDirY;

	if (Key.isDown(Key.M)) {
		leaderShip();
	}

}

function alienMovement() {
	for (var i = 0; i < collidableAlienList.length; i++) {
		if (collidableAlienList[i].position.y < -185 && collidableAlienList[i].name == "ufo") {
			scene.remove(collidableAlienList[i]);
			collidableAlienList.splice(collidableAlienList.indexOf(collidableAlienList[i]), 1);
			ufo = true;
			break;
		}
		if (collidableAlienList[i].name != "ufo") {
			if (collidableAlienList[i].position.x < spaceship.position.x) {
				console.log("Percution");
				scene.remove(shield);
				shieldIsUp = false;
				leaderShip();
				break;
			}
			if (AlienMoveLeft == true) {
				if (collidableAlienList[i].position.y < -185 && collidableAlienList[i].name != "ufo") {
					alienMoveDown();
					AlienMoveLeft = false;
				}
				collidableAlienList[i].position.y -= alienSpeed * pourcentageVitesseAlien;
			}

			if (AlienMoveLeft == false) {
				if (collidableAlienList[i].position.y > 185 && collidableAlienList[i].name != "ufo") {
					alienMoveDown();
					AlienMoveLeft = true;
				}
				collidableAlienList[i].position.y += alienSpeed * pourcentageVitesseAlien;
			}
		} else {
			collidableAlienList[i].position.y -= (ufoSpeed) * pourcentageVitesseAlien;
		}
	}
}

function alienMoveDown() {
	for (var i = 0; i < collidableAlienList.length; i++) {
		if (collidableAlienList[i].name != "ufo") {
			collidableAlienList[i].position.x -= alienSpeed * pourcentageVitesseAlien * 100;
		}
	}
}