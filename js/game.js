(function () {
  let isPause = false;
  let animatonId = null;
  let speed = 5;
  let gameScore = 0;
  let lose = false;

  const car = document.querySelector('.car');
  const trees = document.querySelectorAll('.tree');
  const road = document.querySelector('.road');
  const lines = document.querySelectorAll('.line');
  const coin = document.querySelector('.coin');
  const prep = document.querySelector('.prep');
  const score = document.querySelector('.score');
  const scoreFinish = document.querySelector('.modal__text span');
  const backdrop = document.querySelector('.backdrop');
  const warning = document.querySelector('.warning');

  const treesCoards = [];
  const lineCoards = [];
  const carCoard = getCoard(car);
  const carMove = {
    top: null,
    bottom: null,
    right: null,
    left: null
  };

  const roadHeight = road.clientHeight; 
  const roadWidth = road.clientWidth / 2;

  const carHeight = car.clientHeight;
  const carWidth = car.clientWidth;

  const coinCoard = getCoard(coin);
  const coinWidth = coin.clientWidth;
  const coinHeight = coin.clientHeight / 2;
  let visibleCoin = true;

  const prepCoard = getCoard(prep);
  const prepWidth = prep.clientWidth;
  const prepHeight = prep.clientHeight;
  let visiblePrep = true;

  trees.forEach(tree => {
    const coardsTree = getCoard(tree);
    treesCoards.push(coardsTree);
  })

  lines.forEach(line => {
    const coardsLine = getCoard(line);
    lineCoards.push(coardsLine);
  })

  if (window.innerWidth < 960) {
    warning.style.display = 'flex'
    finishGame();
  }


  const gameButton = document.querySelector('.game-button');

  animatonId = requestAnimationFrame(startGame);

  function finishGame () {
    cancelAnimationFrame(animatonId);
    cancelAnimationFrame(carMove.top);
    cancelAnimationFrame(carMove.bottom);
    cancelAnimationFrame(carMove.left);
    cancelAnimationFrame(carMove.right);
    gameButton.children[0].classList.add('none');
    gameButton.children[1].classList.add('none');
    score.style.display = 'none';
    backdrop.style.display = 'flex';
    scoreFinish.innerText = gameScore;
  }

  function startGame () {

    treesAnimation();
    lineAnimation();
    coinAnimation();
    prepAnimation();

    if (visibleCoin && hasCollisionCoin()) {
      gameScore++;
      score.innerText = gameScore;
      coin.style.visibility = 'hidden';
      visibleCoin = false;

      if (gameScore % 5 === 0) {
        speed += 2;
      }
    }

    if (visiblePrep && hasCollisionPrep()) {
      visiblePrep = false;
      lose = true;
      finishGame();
      return
    }

    animatonId = requestAnimationFrame(startGame);
  }

  function treesAnimation () { 
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i]
      const coards = treesCoards[i];

      let newCoardY = coards.y + speed;

    if (newCoardY > window.innerHeight) {
      newCoardY = -tree.height;
    }

    treesCoards[i].y = newCoardY;
    tree.style.transform = `translate(${coards.x}px, ${newCoardY}px)`;

    }
   }

   function lineAnimation () { 
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const coards = lineCoards[i];

      let newCoardY = coards.y + speed;

    if (newCoardY > window.innerHeight) {
      newCoardY = -60;
    }

    lineCoards[i].y = newCoardY;
    line.style.transform = `translate(${coards.x}px, ${newCoardY}px)`;
    }
   }

   function coinAnimation () {
    let newCoardY = coinCoard.y + speed;
    let newCoardX = coinCoard.x;

    const direction = parseInt(Math.random() * 2);

    if (newCoardY > window.innerHeight) {
      newCoardY = -coin.height;

      coin.style.visibility = 'visible';
      visibleCoin = true

      if (direction === 0) { // лево
        newCoardX = -parseInt(Math.random() * (roadWidth + (1 - coinWidth / 2))); 
      } else if (direction === 1) { // право
        newCoardX = parseInt(Math.random() * (roadWidth + (1 - coinWidth / 2)));
      }
    }

    coinCoard.y =  newCoardY;
    coinCoard.x = newCoardX;
    coin.style.transform = `translate(${newCoardX}px, ${newCoardY}px)`;
   }

   function prepAnimation () {
    let newCoardY = prepCoard.y + speed;
    let newCoardX = prepCoard.x;

    const direction = parseInt(Math.random() * 2);

    if (newCoardY > window.innerHeight) {
      newCoardY = -prep.height;

      visiblePrep = true

      if (direction === 0) { // лево
        newCoardX = -parseInt(Math.random() * (roadWidth + (1 - coinWidth / 2 + 10))); 
      } else if (direction === 1) { // право
        newCoardX = parseInt(Math.random() * (roadWidth + (1 - coinWidth / 2 - 10)));
      }
    }

    prepCoard.y =  newCoardY;
    prepCoard.x = newCoardX;
    prep.style.transform = `translate(${newCoardX}px, ${newCoardY}px)`;
   }

   function hasCollisionCoin () {
    const carYTop = carCoard.y;
    const carYBottom = carCoard.y + carHeight;

    const carXLeft = carCoard.x - carWidth / 2;
    const carXRight = carCoard.x + carWidth / 2;

    const coinYTop = coinCoard.y;
    const coinYBottom = coinCoard.y + coinHeight;

    const coinXLeft = coinCoard.x - coinWidth / 2;
    const coinXRight = coinCoard.x + coinWidth / 2;

    if (carYTop > coinYBottom || carYBottom < coinYTop) {
      return false
    }

    if (carXLeft > coinXRight || carXRight < coinXLeft) {
      return false
    }
    return true
   }

   function hasCollisionPrep () {
    const carYTop = carCoard.y;
    const carYBottom = carCoard.y + carHeight;

    const carXLeft = carCoard.x - carWidth / 2;
    const carXRight = carCoard.x + carWidth / 2;

    const prepYTop = prepCoard.y;
    const prepYBottom = prepCoard.y + prepHeight;

    const prepXLeft = prepCoard.x - prepWidth / 2;
    const prepXRight = prepCoard.x + prepWidth / 2;

    if (carYTop > prepYBottom || carYBottom < prepYTop) {
      return false
    }

    if (carXLeft > prepXRight || carXRight < prepXLeft) {
      return false
    }

    return true
   }

  function getCoard (element) {
    const matrix = window.getComputedStyle(element).transform;
    const array = matrix.split(',');
    const coardY = parseFloat(array[array.length - 1]);
    const coardX = parseFloat(array[array.length - 2]);
    return {x: coardX, y: coardY};
  }

  gameButton.children[0].addEventListener('click', () => {
    gameButton.children[0].classList.add('none');
    gameButton.children[1].classList.add('active');
    isPause = true
    cancelAnimationFrame(animatonId)
    if (isPause) {
      cancelAnimationFrame(carMove.top)
      cancelAnimationFrame(carMove.bottom)
      cancelAnimationFrame(carMove.left)
      cancelAnimationFrame(carMove.right)
    }
  })

  gameButton.children[1].addEventListener('click', () => {
    gameButton.children[0].classList.remove('none');
    gameButton.children[1].classList.remove('active');
    animatonId = requestAnimationFrame(startGame);
    isPause = false
  })

  document.addEventListener('keydown', (event) => {
    if (!isPause) {
      if (event.code === 'ArrowUp' && carMove.top === null) {
        carMove.top = requestAnimationFrame(moveCarToTop);
      } else if (event.code === 'ArrowDown' && carMove.bottom === null) {
        carMove.bottom = requestAnimationFrame(moveCarToBottom);
      } else if (event.code === 'ArrowLeft' && carMove.left === null) {
        carMove.left = requestAnimationFrame(moveCarToLeft);
      } else if (event.code === 'ArrowRight' && carMove.right === null) {
        carMove.right = requestAnimationFrame(moveCarToRight);
      }
    }
  })

  document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowUp') {
      cancelAnimationFrame(carMove.top)
      carMove.top = null
    } else if (event.code === 'ArrowDown') {
      cancelAnimationFrame(carMove.bottom)
      carMove.bottom = null
    } else if (event.code === 'ArrowLeft') {
      cancelAnimationFrame(carMove.left)
      carMove.left = null
    } else if (event.code === 'ArrowRight') {
      cancelAnimationFrame(carMove.right)
      carMove.right = null
    }
  })

  document.querySelector('.restart_button').addEventListener('click', () => {
    window.location.reload()
  })

  function moveCarToTop () {
    if (!lose) {
      const newY = carCoard.y - 8;
    if (newY < 0) {
      return
    }
    carCoard.y = newY;
    car.style.transform = `translate(${carCoard.x}px, ${newY}px)`;
    carMove.top = requestAnimationFrame(moveCarToTop);
    }
  };

  function moveCarToBottom () {
    if (!lose) {
      const newY = carCoard.y + 8;
      if ((newY + carHeight) > roadHeight) {
        return
      }
      carCoard.y = newY;
      car.style.transform = `translate(${carCoard.x}px, ${newY}px)`;
      carMove.bottom = requestAnimationFrame(moveCarToBottom);
    }
  };

  function moveCarToLeft () {
    if (!lose) {
      const newX = carCoard.x - 8;
    if (newX < -roadWidth + (carWidth / 2)) {
      return
    }
    carCoard.x = newX;
    car.style.transform = `translate(${newX}px, ${carCoard.y}px)`;
    carMove.left = requestAnimationFrame(moveCarToLeft);
    }
  };

  function moveCarToRight () {
    if (!lose) {
      const newX = carCoard.x + 8;
    if (newX > roadWidth + (carWidth / 2 - 80)) {
      return
    }
    carCoard.x = newX;
    car.style.transform = `translate(${newX}px, ${carCoard.y}px)`;
    carMove.right = requestAnimationFrame(moveCarToRight);
    }
  };





  })();
