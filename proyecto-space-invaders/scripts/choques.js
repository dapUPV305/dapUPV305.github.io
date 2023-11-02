function detectCollisionBunker() {
	var caster = new THREE.Raycaster();
	caster.set(missile.position, new THREE.Vector3(1, 0, 1));
	var collisionsBunker = caster.intersectObjects(collidableMeshList);
	if (collisionsBunker.length > 0) {
		collisionsBunker[0].object.material.opacity -= 0.1;
		scene.remove(missile);
		if (collisionsBunker[0].object.material.opacity < 0) {
			console.log(collidableMeshList.indexOf(collisionsBunker[0].object));
			collidableMeshList.splice(collidableMeshList.indexOf(collisionsBunker[0].object), 1);
			scene.remove(collisionsBunker[0].object);
		}
		missileIsAlive = false;
		shotMissile = 0;
	}
}

function detectIfSpaceshipMissileCollisionAlien() {
	var casterAlien = new THREE.Raycaster();
	casterAlien.set(missile.position, new THREE.Vector3(1, 0, 0));
	casterAlien.far = missileSpeed * 2;
	var collisionsAlien = casterAlien.intersectObjects(collidableAlienList);
	if (collisionsAlien.length > 0) {
		afficherScore(50);
		scene.remove(collisionsAlien[0].object);
		scene.remove(missile);
		collidableAlienList.splice(collidableAlienList.indexOf(collisionsAlien[0].object), 1);
		shotMissile = 0;
		missileIsAlive = false;
		if (collisionsAlien[0].object.name == "ufo") {
			ufo = true;
			if (!shieldIsUp) {
				createShield();
			}
		}
		if (collidableAlienList.length == 0 && ufo || collidableAlienList.length == 1 && !ufo) {
			newWave();
		}
	}
}



function detectCollisionFromMissileAlien() {
	for (var i = 0; i < collidableMissileAlien.length; i++) {
		var caster = new THREE.Raycaster();
		caster.set(collidableMissileAlien[i].position, new THREE.Vector3(1, 0, 1));
		caster.far = missileSpeed * 2;

		var collisionsBunker = caster.intersectObjects(collidableMeshList);
		if (collisionsBunker.length > 0) {
			scene.remove(collidableMissileAlien[i]);
			collisionsBunker[0].object.material.opacity -= 0.1;
			collidableMissileAlien.splice(i--, 1);

			if (collisionsBunker[0].object.material.opacity < 0) {
				collidableMeshList.splice(collidableMeshList.indexOf(collisionsBunker[0].object), 1);
				scene.remove(collisionsBunker[0].object);
			}
		} else {
			detectShootSpeceshipFromAlien(collidableMissileAlien[i]);
		}
	}

}

function detectShootSpeceshipFromAlien(missileUniqueAlien) {
	var casterSpaceship = new THREE.Raycaster();
	casterSpaceship.set(missileUniqueAlien.position, new THREE.Vector3(1, 0, 1));
	var collisionsSpaceship = casterSpaceship.intersectObject(spaceship);
	casterSpaceship.far = missileSpeed * 2;

	if (collisionsSpaceship.length > 0 && spaceshipIsTargetable) {
		scene.remove(missileUniqueAlien);
		if (shieldIsUp) {
			scene.remove(shield);
			setTimeout(function () { shieldIsUp = false }, 200);
		} else {
			spaceshipLife--;
			if (spaceshipLife == -1) {
				leaderShip();
			} else {
				hitSpaceship();
			}
		}
	}
}