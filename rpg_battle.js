const monster = {
  maxHealth: 10,
  name: "Лютый",
  moves: [
    {
      "name": "Удар когтистой лапой",
      "physicalDmg": 3, // физический урон
      "magicDmg": 0,    // магический урон
      "physicArmorPercents": 20, // физическая броня
      "magicArmorPercents": 20,  // магическая броня
      "cooldown": 0     // ходов на восстановление
    },
    {
      "name": "Огненное дыхание",
      "physicalDmg": 0,
      "magicDmg": 4,
      "physicArmorPercents": 0,
      "magicArmorPercents": 0,
      "cooldown": 3
    },
    {
      "name": "Удар хвостом",
      "physicalDmg": 2,
      "magicDmg": 0,
      "physicArmorPercents": 50,
      "magicArmorPercents": 0,
      "cooldown": 2
    },
  ]
}

const magician = {
  maxHealth: 10,
  name: "Евстафий",
  moves: [
    {
      "name": "Удар боевым кадилом",
      "physicalDmg": 2,
      "magicDmg": 0,
      "physicArmorPercents": 0,
      "magicArmorPercents": 50,
      "cooldown": 0
    },
    {
      "name": "Вертушка левой пяткой",
      "physicalDmg": 4,
      "magicDmg": 0,
      "physicArmorPercents": 0,
      "magicArmorPercents": 0,
      "cooldown": 4
    },
    {
      "name": "Каноничный фаербол",
      "physicalDmg": 0,
      "magicDmg": 5,
      "physicArmorPercents": 0,
      "magicArmorPercents": 0,
      "cooldown": 3
    },
    {
      "name": "Магический блок",
      "physicalDmg": 0,
      "magicDmg": 0,
      "physicArmorPercents": 100,
      "magicArmorPercents": 100,
      "cooldown": 4
    },
  ]
}


class DefaultPlayer {
  constructor({maxHealth, name, moves}) {
    this.maxHealth = maxHealth;
    this.name = name;
    this.moves = moves;
    this.currentCooldowns = this.moves.map(({cooldown}) => cooldown);
    this.currentHealth = this.maxHealth;
  }

  static checkGameOver(player1, player2) {
    if (player1.currentHealth <= 0) {
      return player2.name;
    }
    if (player2.currentHealth <= 0) {
      return player1.name;
    }
    return false;
  }

  _updateCurrentCooldowns(moveIndex) {
    this.currentCooldowns.forEach((cooldown, i) => {
      if (cooldown < this.moves[i].cooldown) {
        this.currentCooldowns[i]++;
      }
    });
    this.currentCooldowns[moveIndex] = 0;
  }

  selectMove() {
    let moveIndex;
    do {
      moveIndex = Math.floor(Math.random() * (this.moves.length));
    } while (this.currentCooldowns[moveIndex] < this.moves[moveIndex].cooldown);
    this._updateCurrentCooldowns(moveIndex);
    this.currentMove = this.moves[moveIndex];
  }

  makeDamage(opponent) {
    if (opponent.currentMove.physicArmorPercents < this.currentMove.physicalDmg) {
      opponent.currentHealth += opponent.currentMove.physicArmorPercents - this.currentMove.physicalDmg;
    }
    if (opponent.currentMove.magicArmorPercents < this.currentMove.magicDmg) {
      opponent.currentHealth += opponent.currentMove.magicArmorPercents - this.currentMove.magicDmg;
    }
  }
}


class UserPlayer extends DefaultPlayer {
  constructor({maxHealth, name, moves}) {
    super({maxHealth, name, moves});
  }

  setMaxHealth() {
    do {
      this.maxHealth = parseInt(prompt('Введите ваше начальное здоровье:'));
    } while (!this.maxHealth);
    this.currentHealth = this.maxHealth;
  }

  selectMove() {
    let moveIndex;
    while (true) {
      moveIndex = parseInt(prompt(`Выберете ваше оружение (число от 1 до ${this.moves.length}):`)) - 1;
      if (!(moveIndex >= 0 && moveIndex < this.moves.length)) continue;
      if (this.currentCooldowns[moveIndex] + 1 < this.moves[moveIndex].cooldown) {
        alert(`
          Вы уже использовали это оружие.
          Следующее использование возможно через ${this.moves[moveIndex].cooldown - this.currentCooldowns[moveIndex] - 1} ходов.
          Выберете другое.
        `);
      } else break;
    }
    this._updateCurrentCooldowns(moveIndex);
    this.currentMove = this.moves[moveIndex];
  }
}

function makeMove() {
  lutik.selectMove();
  alert(`${lutik.name} выбирает ${lutik.currentMove.name}.`);
  stefan.selectMove();
  lutik.makeDamage(stefan);
  stefan.makeDamage(lutik);
  alert(`
          ${stefan.currentMove.name}! Посмотрим кто кого!
          ${lutik.currentMove.name} VS ${stefan.currentMove.name}

          физический урон Лютого ${lutik.currentMove.physicalDmg} VS физическая броня Евстафия ${stefan.currentMove.physicArmorPercents}
          магический урон Лютого ${lutik.currentMove.magicDmg} VS магическая броня Евстафия ${stefan.currentMove.magicArmorPercents}

          физический урон Евстафия ${stefan.currentMove.physicalDmg} VS физическая броня Лютого ${lutik.currentMove.physicArmorPercents}
          магический урон Евстафия ${stefan.currentMove.magicDmg} VS магическая броня Лютого ${lutik.currentMove.magicArmorPercents}
        `);

  let winner = DefaultPlayer.checkGameOver(lutik, stefan);
  if (!winner) {
    alert(`
            Борьба продолжается:
            Здоровье Евстафия: ${stefan.currentHealth}
            Здоровье Лютого: ${lutik.currentHealth}
            Делаем следующий ход...
        `);
    makeMove();
  } else {
    alert(`Игра окончена! ${winner} одерживает победу!`);
  }
}


const lutik = new DefaultPlayer(monster);
const stefan = new UserPlayer(magician);

function startGame() {
  stefan.setMaxHealth();
  makeMove();
}

while (confirm('Начать игру?')) startGame();
alert('До встречи =)');
