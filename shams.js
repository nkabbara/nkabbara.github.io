// this is based on oneko.js: https://github.com/adryd325/oneko.js

(function shams() {
  let isIdle = true;

  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const shamsEl = document.createElement("div");

  let shamsPosX = 0;
  let shamsPosY = 0;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const shamsSpeed = 10;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  function init() {
    shamsEl.addEventListener("contextmenu", createShamsContextMenu);

    shamsEl.id = "shams";
    shamsEl.ariaHidden = true;
    shamsEl.style.width = "32px";
    shamsEl.style.height = "32px";
    shamsEl.style.position = "absolute";
    shamsEl.style.pointerEvents = "auto";
    shamsEl.style.imageRendering = "pixelated";
    shamsEl.style.zIndex = Number.MAX_VALUE;

    let shamsFile = "/assets/shams.gif";
    const curScript = document.currentScript;
    if (curScript && curScript.dataset.cat) {
      shamsFile = curScript.dataset.cat;
    }
    shamsEl.style.backgroundImage = `url(${shamsFile})`;

    const container = document.getElementById("shams-container");
    container.appendChild(shamsEl);

    //Start position should be from container.
    const rect = container.getBoundingClientRect();
    shamsPosX = rect.left;
    shamsPosY = rect.top + window.scrollY;

    shamsEl.style.left = `${shamsPosX}px`;
    shamsEl.style.top = `${shamsPosY}px`;

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    // Stops execution if the neko element is removed from DOM
    if (!shamsEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    shamsEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (shamsPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (shamsPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (shamsPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (shamsPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function explodeHearts() {
    const parent = shamsEl.parentElement;
    const rect = shamsEl.getBoundingClientRect();
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const centerX = rect.left + rect.width / 2 + scrollLeft;
    const centerY = rect.top + rect.height / 2 + scrollTop;

    for (let i = 0; i < 10; i++) {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent = "❤";
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;
      heart.style.left = `${centerX + offsetX - 16}px`;
      heart.style.top = `${centerY + offsetY - 16}px`;
      heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
      parent.appendChild(heart);

      setTimeout(() => {
        parent.removeChild(heart);
      }, 1000);
    }
  }

  const style = document.createElement("style");
  style.innerHTML = `
		  @keyframes heartBurst {
			  0% { transform: scale(0); opacity: 1; }
			  100% { transform: scale(1); opacity: 0; }
		  }
		  .heart {
			  position: absolute;
			  font-size: 2em;
			  animation: heartBurst 1s ease-out;
			  animation-fill-mode: forwards;
			  color: #ab9df2;
		  }
	  `;

  document.head.appendChild(style);
  // nekoEl.addEventListener("click", explodeHearts);
  shamsEl.addEventListener("click", function (event) {
    isIdle = !isIdle;
    const rect = shamsEl.getBoundingClientRect();
    if (isIdle) {
      shamsEl.style.position = "absolute";
      // Convert position to be relative to document rather than viewport
      shamsPosX = rect.left + window.scrollX;
      shamsPosY = rect.top + window.scrollY;
      mousePosX = shamsPosX;
      mousePosY = shamsPosY;
    } else {
      shamsPosX = rect.left;
      shamsPosY = rect.top;
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    }

    explodeHearts(); // Keep the heart explosion effect
  });

  function frame() {
    frameCount += 1;

    // If idle mode is on, just show idle animation and return
    if (isIdle) {
      idle();
      return;
    }
    const adjustedMouseX = mousePosX + window.scrollX;
    const adjustedMouseY = mousePosY + window.scrollY;

    const diffX = shamsPosX - adjustedMouseX;
    const diffY = shamsPosY - adjustedMouseY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < shamsSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    shamsPosX -= (diffX / distance) * shamsSpeed;
    shamsPosY -= (diffY / distance) * shamsSpeed;

    shamsPosX = Math.min(Math.max(16, shamsPosX), window.innerWidth - 16);
    shamsPosY = Math.min(Math.max(16, shamsPosY), window.innerHeight - 16);

    shamsEl.style.left = `${shamsPosX - 16}px`;
    shamsEl.style.top = `${shamsPosY - 16}px`;
  }

  function createShamsContextMenu(event) {
    event.preventDefault();

    // Remove any existing context menu
    const existingMenu = document.querySelector(".shams-context-menu");
    if (existingMenu) {
      existingMenu.remove();
    }

    // Create and add the new menu
    const menu = document.createElement("div");
    menu.className = "shams-context-menu";
    menu.innerHTML = `<a href="/shamsito">meow</a>`;

    // Position the menu at click location
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;

    document.body.appendChild(menu);

    // Close menu when clicking elsewhere
    const closeMenu = function () {
      menu.remove();
      document.removeEventListener("click", closeMenu);
    };

    setTimeout(() => {
      document.addEventListener("click", closeMenu);
    }, 0);
  }

  init();
})();
