const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './abc.mind',
			maxTrack: 3,
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		// Load and configure ape model
		const ape = await loadGLTF("./ape/scene.gltf");
		ape.scene.scale.set(0.3, 0.3, 0.3);
		ape.scene.position.set(0, -0.2, 0);
		
		const apeMixer = new THREE.AnimationMixer(ape.scene);
		const apeAction = apeMixer.clipAction(ape.animations[0]);
		apeAction.play();
		// Load and configure ape audio
		const apeAclip = await loadAudio("./sound/ape.mp3");
		const apeListener = new THREE.AudioListener();
		const apeAudio = new THREE.PositionalAudio(apeListener);	
		
		
		// Load and configure bug model
		const bug = await loadGLTF("./bug/scene.gltf");
		bug.scene.scale.set(0.4, 0.4, 0.4);
		
		const bugMixer = new THREE.AnimationMixer(bug.scene);
		const bugAction = bugMixer.clipAction(bug.animations[0]);
		bugAction.play();
		
		// Load and configure bug audio
		const bugAclip = await loadAudio("./sound/bug.mp3");
		const bugListener = new THREE.AudioListener();
		const bugAudio = new THREE.PositionalAudio(bugListener);	
		
		// Load and configure cow model
		const cow = await loadGLTF("./cow/scene.gltf");
		cow.scene.scale.set(0.1, 0.1, 0.1);
		cow.scene.position.set(0, -0.2, 0);
		
		const cowMixer = new THREE.AnimationMixer(cow.scene);
		const cowAction = cowMixer.clipAction(cow.animations[0]);
		cowAction.play();
		
		// Load and configure cow audio
		const cowAclip = await loadAudio("./sound/cow.mp3");
		const cowListener = new THREE.AudioListener();
		const cowAudio = new THREE.PositionalAudio(cowListener);	
		
		// Ape anchor
		const apeAnchor = mindarThree.addAnchor(0);
		apeAnchor.group.add(ape.scene);
		camera.add(apeListener);
		apeAudio.setRefDistance(100);
		apeAudio.setBuffer(apeAclip);
		apeAudio.setLoop(true);
		apeAnchor.group.add(apeAudio);
		
		apeAnchor.onTargetFound = () => {
			apeAudio.play();
		}
		apeAnchor.onTargetLost = () => {
			apeAudio.pause();
		}
		
		// Bug anchor
		const bugAnchor = mindarThree.addAnchor(1);
		bugAnchor.group.add(bug.scene);
		camera.add(bugListener);
		bugAudio.setRefDistance(100);
		bugAudio.setBuffer(bugAclip);
		bugAudio.setLoop(true);
		bugAnchor.group.add(bugAudio);
		bugAnchor.onTargetFound = () => {
			bugAudio.play();
		}
		bugAnchor.onTargetLost = () => {
			bugAudio.pause();
		}
		
		// Cow anchor
		const cowAnchor = mindarThree.addAnchor(2);
		cowAnchor.group.add(cow.scene);
		camera.add(cowListener);
		cowAudio.setRefDistance(100);
		cowAudio.setBuffer(cowAclip);
		cowAudio.setLoop(true);
		cowAnchor.group.add(cowAudio);
		cowAnchor.onTargetFound = () => {
			cowAudio.play();
		}
		cowAnchor.onTargetLost = () => {
			cowAudio.pause();
		}
		
		const clock = new THREE.Clock();
		
		await mindarThree.start();		
		
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			apeMixer.update(delta);
			bugMixer.update(delta);
			cowMixer.update(delta);
			cow.scene.rotation.set(0, cow.scene.rotation.y + delta, 0);
			renderer.render(scene, camera);
		});
	}
	start();
});
