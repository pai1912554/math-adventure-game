// ===== GAME STATE =====
const gameState = {
    character: null,
    currentWorld: 1,
    currentQuestion: 0,
    totalQuestions: 10,
    score: 0,
    totalScore: 0,
    lives: 3,
    maxLives: 3,
    streak: 0,
    maxStreak: 0,
    hints: 0,
    stars: 0,
    worldStars: [0, 0, 0, 0, 0],
    worldUnlocked: [true, false, false, false, false],
    correctAnswers: 0,
    totalTime: 0,
    timerInterval: null,
    timeLeft: 0,
    maxTime: 20,
    isAnswering: false,
    enemyHP: 3,
    enemyMaxHP: 3,
    scoreMultiplier: 1,
    bonusTime: 0,
};

// ===== WORLD DATA =====
const worlds = [
    {
        id: 1,
        name: 'ป่าบวกลบ',
        scene: 'scene-forest',
        icon: '🌳',
        timeLimit: 20,
        enemies: [
            { name: 'สไลม์เขียว', emoji: '🟢', hp: 2 },
            { name: 'หมาป่าตัวเลข', emoji: '🐺', hp: 3 },
            { name: 'ต้นไม้ปีศาจ', emoji: '🌲', hp: 3 },
            { name: 'ผีเสื้อพิษ', emoji: '🦋', hp: 2 },
            { name: 'บอสกอบลิน', emoji: '👹', hp: 5 },
        ],
        generateQuestion: () => generateAddSubQuestion(),
    },
    {
        id: 2,
        name: 'ภูเขาคูณหาร',
        scene: 'scene-mountain',
        icon: '🏔️',
        timeLimit: 25,
        enemies: [
            { name: 'ค้างคาวหิน', emoji: '🦇', hp: 3 },
            { name: 'โกเลมหิน', emoji: '🗿', hp: 4 },
            { name: 'อินทรียักษ์', emoji: '🦅', hp: 3 },
            { name: 'มังกรน้อย', emoji: '🐉', hp: 4 },
            { name: 'บอสยักษ์ภูเขา', emoji: '👺', hp: 6 },
        ],
        generateQuestion: () => generateMulDivQuestion(),
    },
    {
        id: 3,
        name: 'ทะเลเศษส่วน',
        scene: 'scene-ocean',
        icon: '🌊',
        timeLimit: 30,
        enemies: [
            { name: 'ปลาหมึกยักษ์', emoji: '🐙', hp: 3 },
            { name: 'ฉลามตัวเลข', emoji: '🦈', hp: 4 },
            { name: 'เงือกดำ', emoji: '🧜', hp: 4 },
            { name: 'ปูยักษ์', emoji: '🦀', hp: 3 },
            { name: 'บอสเจ้าสมุทร', emoji: '🐋', hp: 7 },
        ],
        generateQuestion: () => generateFractionQuestion(),
    },
    {
        id: 4,
        name: 'อวกาศตัวเลข',
        scene: 'scene-space',
        icon: '🌌',
        timeLimit: 25,
        enemies: [
            { name: 'เอเลี่ยนสีเขียว', emoji: '👽', hp: 4 },
            { name: 'หุ่นยนต์จักรกล', emoji: '🤖', hp: 5 },
            { name: 'ดาวตกพิษ', emoji: '☄️', hp: 3 },
            { name: 'จานบินปริศนา', emoji: '🛸', hp: 4 },
            { name: 'บอสจอมจักรวาล', emoji: '🌑', hp: 8 },
        ],
        generateQuestion: () => generateMixedQuestion(),
    },
    {
        id: 5,
        name: 'ปราสาทโจทย์ปัญหา',
        scene: 'scene-castle',
        icon: '🏰',
        timeLimit: 35,
        enemies: [
            { name: 'อัศวินเงา', emoji: '🗡️', hp: 5 },
            { name: 'แม่มดตัวเลข', emoji: '🧙‍♀️', hp: 5 },
            { name: 'มังกรไฟ', emoji: '🐲', hp: 6 },
            { name: 'ยักษ์ปราสาท', emoji: '👾', hp: 5 },
            { name: 'จอมมารคณิตศาสตร์', emoji: '😈', hp: 10 },
        ],
        generateQuestion: () => generateWordProblem(),
    },
];

// ===== CHARACTER DATA =====
const characters = {
    knight: { emoji: '🧑‍🎤', name: 'อัศวินตัวเลข', bonusLives: 1, bonusTime: 0, scoreMulti: 1, bonusHints: 0 },
    wizard: { emoji: '🧙', name: 'จอมเวทคำนวณ', bonusLives: 0, bonusTime: 5, scoreMulti: 1, bonusHints: 0 },
    ninja: { emoji: '🥷', name: 'นินจาสูตรคูณ', bonusLives: 0, bonusTime: 0, scoreMulti: 1.5, bonusHints: 0 },
    fairy: { emoji: '🧚', name: 'นางฟ้าเลขมหัศจรรย์', bonusLives: 0, bonusTime: 0, scoreMulti: 1, bonusHints: 3 },
};

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showCharacterSelect() {
    showScreen('character-screen');
}

function showHowTo() {
    showScreen('howto-screen');
}

function showHighScores() {
    renderHighScores();
    showScreen('scores-screen');
}

// ===== CHARACTER SELECT =====
function selectCharacter(charKey) {
    gameState.character = charKey;
    const char = characters[charKey];
    gameState.maxLives = 3 + char.bonusLives;
    gameState.lives = gameState.maxLives;
    gameState.bonusTime = char.bonusTime;
    gameState.scoreMultiplier = char.scoreMulti;
    gameState.hints = char.bonusHints;
    gameState.totalScore = 0;
    gameState.stars = 0;
    gameState.worldStars = [0, 0, 0, 0, 0];
    gameState.worldUnlocked = [true, false, false, false, false];

    document.getElementById('map-character').textContent = char.emoji + ' ' + char.name;
    updateMap();
    showScreen('map-screen');
}

// ===== MAP =====
function updateMap() {
    document.getElementById('map-stars').textContent = gameState.stars;
    document.getElementById('map-score').textContent = gameState.totalScore;

    for (let i = 1; i <= 5; i++) {
        const node = document.getElementById('world-' + i);
        const starsEl = document.getElementById('w' + i + '-stars');

        node.classList.remove('locked', 'completed', 'current');

        if (!gameState.worldUnlocked[i - 1]) {
            node.classList.add('locked');
            node.querySelector('.lock-overlay').style.display = 'block';
        } else {
            node.querySelector('.lock-overlay').style.display = 'none';

            if (gameState.worldStars[i - 1] > 0) {
                node.classList.add('completed');
            } else {
                node.classList.add('current');
            }
        }

        const ws = gameState.worldStars[i - 1];
        let starStr = '';
        for (let s = 0; s < 3; s++) {
            starStr += s < ws ? '★' : '☆';
        }
        starsEl.textContent = starStr;
    }
}

function enterWorld(worldId) {
    if (!gameState.worldUnlocked[worldId - 1]) return;
    gameState.currentWorld = worldId;
    startGame();
}

// ===== QUESTION GENERATORS =====
function generateAddSubQuestion() {
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;

    if (op === '+') {
        a = randInt(1, 50);
        b = randInt(1, 50);
        answer = a + b;
    } else {
        a = randInt(10, 99);
        b = randInt(1, a);
        answer = a - b;
    }

    return {
        text: `${a} ${op} ${b} = ?`,
        answer: answer,
        choices: generateChoices(answer, 0, 100),
    };
}

function generateMulDivQuestion() {
    const ops = ['×', '÷'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;

    if (op === '×') {
        a = randInt(2, 12);
        b = randInt(2, 12);
        answer = a * b;
    } else {
        b = randInt(2, 12);
        answer = randInt(1, 12);
        a = b * answer;
    }

    return {
        text: `${a} ${op} ${b} = ?`,
        answer: answer,
        choices: generateChoices(answer, 1, 150),
    };
}

function generateFractionQuestion() {
    const types = ['simplify', 'add', 'compare'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'simplify') {
        const base = randInt(1, 6);
        const multiplier = randInt(2, 5);
        const num = base * multiplier;
        const den = randInt(base + 1, 10) * multiplier;
        const gcd = getGCD(num, den);
        const simpNum = num / gcd;
        const simpDen = den / gcd;
        const answer = `${simpNum}/${simpDen}`;

        const wrongChoices = [];
        while (wrongChoices.length < 3) {
            const wn = randInt(1, 8);
            const wd = randInt(2, 10);
            const wStr = `${wn}/${wd}`;
            if (wStr !== answer && !wrongChoices.includes(wStr)) {
                wrongChoices.push(wStr);
            }
        }

        return {
            text: `ทำให้เป็นเศษส่วนอย่างต่ำ: ${num}/${den} = ?`,
            answer: answer,
            choices: shuffleArray([answer, ...wrongChoices]),
            isText: true,
        };
    } else if (type === 'add') {
        const den = [2, 3, 4, 5, 6, 8, 10][Math.floor(Math.random() * 7)];
        const a = randInt(1, den - 1);
        const b = randInt(1, den - 1);
        const sumNum = a + b;
        const gcd = getGCD(sumNum, den);
        let answerStr;
        if (sumNum / gcd >= den / gcd) {
            const whole = Math.floor((sumNum / gcd) / (den / gcd));
            const remainder = (sumNum / gcd) % (den / gcd);
            answerStr = remainder === 0 ? `${whole}` : `${whole} ${remainder}/${den / gcd}`;
        } else {
            answerStr = `${sumNum / gcd}/${den / gcd}`;
        }

        const wrongChoices = [];
        while (wrongChoices.length < 3) {
            const wn = randInt(1, 10);
            const wd = randInt(2, 10);
            const wStr = `${wn}/${wd}`;
            if (wStr !== answerStr && !wrongChoices.includes(wStr)) {
                wrongChoices.push(wStr);
            }
        }

        return {
            text: `${a}/${den} + ${b}/${den} = ?`,
            answer: answerStr,
            choices: shuffleArray([answerStr, ...wrongChoices]),
            isText: true,
        };
    } else {
        const a_num = randInt(1, 5);
        const a_den = randInt(2, 8);
        let b_num, b_den;
        do {
            b_num = randInt(1, 5);
            b_den = randInt(2, 8);
        } while (a_num / a_den === b_num / b_den);

        const aVal = a_num / a_den;
        const bVal = b_num / b_den;
        const answer = aVal > bVal ? '>' : '<';

        return {
            text: `${a_num}/${a_den} __ ${b_num}/${b_den}\nเลือกเครื่องหมายที่ถูกต้อง`,
            answer: answer,
            choices: shuffleArray(['>', '<', '=', '≠']),
            isText: true,
        };
    }
}

function generateMixedQuestion() {
    const types = ['order', 'missing', 'twoStep'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'order') {
        const a = randInt(2, 9);
        const b = randInt(2, 9);
        const c = randInt(1, 20);
        const answer = a * b + c;
        return {
            text: `${a} × ${b} + ${c} = ?`,
            answer: answer,
            choices: generateChoices(answer, 1, 100),
        };
    } else if (type === 'missing') {
        const a = randInt(5, 30);
        const answer = randInt(3, 20);
        const result = a + answer;
        return {
            text: `${a} + ? = ${result}`,
            answer: answer,
            choices: generateChoices(answer, 1, 50),
        };
    } else {
        const a = randInt(10, 50);
        const b = randInt(2, 10);
        const c = randInt(1, 10);
        const answer = a - b * c;
        return {
            text: `${a} - ${b} × ${c} = ?`,
            answer: answer,
            choices: generateChoices(answer, -20, 60),
        };
    }
}

function generateWordProblem() {
    const problems = [
        () => {
            const items = ['แอปเปิ้ล', 'ส้ม', 'กล้วย', 'มะม่วง'];
            const item = items[Math.floor(Math.random() * items.length)];
            const a = randInt(10, 30);
            const b = randInt(5, a - 1);
            const c = randInt(1, 10);
            const answer = a - b + c;
            return {
                text: `มี${item} ${a} ผล แจกไป ${b} ผล แล้วซื้อเพิ่ม ${c} ผล เหลือกี่ผล?`,
                answer: answer,
                choices: generateChoices(answer, 1, 50),
            };
        },
        () => {
            const price = randInt(10, 50);
            const qty = randInt(2, 8);
            const answer = price * qty;
            return {
                text: `ปากกาด้ามละ ${price} บาท ซื้อ ${qty} ด้าม จ่ายกี่บาท?`,
                answer: answer,
                choices: generateChoices(answer, 10, 400),
            };
        },
        () => {
            const total = randInt(20, 100);
            const groups = randInt(2, 10);
            const answer = Math.floor(total / groups);
            const actualTotal = answer * groups;
            return {
                text: `แบ่งขนม ${actualTotal} ชิ้น ให้เด็ก ${groups} คน คนละเท่าๆ กัน ได้คนละกี่ชิ้น?`,
                answer: answer,
                choices: generateChoices(answer, 1, 50),
            };
        },
        () => {
            const length = randInt(5, 20);
            const width = randInt(3, 15);
            const answer = length * width;
            return {
                text: `สนามยาว ${length} ม. กว้าง ${width} ม. พื้นที่เท่าไหร่? (ตร.ม.)`,
                answer: answer,
                choices: generateChoices(answer, 10, 300),
            };
        },
        () => {
            const perimeter = randInt(2, 8) * 4;
            const answer = perimeter / 4;
            return {
                text: `สี่เหลี่ยมจัตุรัสมีเส้นรอบรูป ${perimeter} ซม. ด้านยาวกี่ซม.?`,
                answer: answer,
                choices: generateChoices(answer, 1, 20),
            };
        },
        () => {
            const morning = randInt(10, 30);
            const afternoon = randInt(10, 30);
            const answer = morning + afternoon;
            return {
                text: `ร้านค้าขายของเช้า ${morning} ชิ้น บ่าย ${afternoon} ชิ้น รวมขายกี่ชิ้น?`,
                answer: answer,
                choices: generateChoices(answer, 10, 80),
            };
        },
        () => {
            const money = randInt(50, 200);
            const spend = randInt(10, money - 10);
            const answer = money - spend;
            return {
                text: `มีเงิน ${money} บาท ซื้อของ ${spend} บาท เหลือเงินกี่บาท?`,
                answer: answer,
                choices: generateChoices(answer, 1, 200),
            };
        },
        () => {
            const rows = randInt(3, 8);
            const cols = randInt(3, 8);
            const answer = rows * cols;
            return {
                text: `ปลูกต้นไม้เป็นแถว ${rows} แถว แถวละ ${cols} ต้น มีกี่ต้น?`,
                answer: answer,
                choices: generateChoices(answer, 5, 70),
            };
        },
    ];

    const idx = Math.floor(Math.random() * problems.length);
    return problems[idx]();
}

// ===== UTILITY FUNCTIONS =====
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateChoices(answer, min, max) {
    const choices = [answer];
    while (choices.length < 4) {
        let wrong;
        const deviation = Math.max(1, Math.floor(Math.abs(answer) * 0.5));
        wrong = answer + randInt(-deviation - 3, deviation + 3);
        if (wrong < min) wrong = randInt(min, max);
        if (wrong !== answer && !choices.includes(wrong)) {
            choices.push(wrong);
        }
    }
    return shuffleArray(choices);
}

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getGCD(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

// ===== GAME LOGIC =====
function startGame() {
    const world = worlds[gameState.currentWorld - 1];
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.lives = gameState.maxLives;
    gameState.streak = 0;
    gameState.maxStreak = 0;
    gameState.correctAnswers = 0;
    gameState.totalTime = 0;
    gameState.isAnswering = false;

    document.getElementById('scene-bg').className = world.scene;
    document.getElementById('world-name').textContent = world.icon + ' ' + world.name;
    document.getElementById('player-body').textContent = characters[gameState.character].emoji;

    updateHUD();
    showScreen('game-screen');
    loadQuestion();
}

function loadQuestion() {
    if (gameState.currentQuestion >= gameState.totalQuestions) {
        endWorld(true);
        return;
    }

    const world = worlds[gameState.currentWorld - 1];
    const question = world.generateQuestion();
    gameState.currentQuestionData = question;
    gameState.isAnswering = true;

    const enemyIdx = Math.min(
        Math.floor(gameState.currentQuestion / 2),
        world.enemies.length - 1
    );
    const enemy = world.enemies[enemyIdx];
    gameState.enemyMaxHP = enemy.hp;
    gameState.enemyHP = enemy.hp;

    document.getElementById('enemy-body').textContent = enemy.emoji;
    document.getElementById('enemy-name').textContent = enemy.name;
    document.getElementById('enemy-hp').style.width = '100%';

    document.getElementById('question-progress').textContent =
        `ข้อ ${gameState.currentQuestion + 1}/${gameState.totalQuestions}`;
    document.getElementById('question-text').textContent = question.text;

    const grid = document.getElementById('answers-grid');
    grid.innerHTML = '';

    question.choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = question.isText ? choice : choice;
        btn.onclick = () => checkAnswer(choice, btn);
        grid.appendChild(btn);
    });

    startTimer(world.timeLimit + gameState.bonusTime);
}

function checkAnswer(selected, btnEl) {
    if (!gameState.isAnswering) return;
    gameState.isAnswering = false;

    clearInterval(gameState.timerInterval);
    const timeUsed = (worlds[gameState.currentWorld - 1].timeLimit + gameState.bonusTime) - gameState.timeLeft;
    gameState.totalTime += timeUsed;

    const correct = String(selected) === String(gameState.currentQuestionData.answer);

    document.querySelectorAll('.answer-btn').forEach(b => {
        b.disabled = true;
        if (String(b.textContent) === String(gameState.currentQuestionData.answer)) {
            b.classList.add('correct');
        }
    });

    if (correct) {
        btnEl.classList.add('correct');
        onCorrectAnswer(timeUsed);
    } else {
        btnEl.classList.add('wrong');
        onWrongAnswer();
    }
}

function onCorrectAnswer(timeUsed) {
    gameState.correctAnswers++;
    gameState.streak++;
    if (gameState.streak > gameState.maxStreak) gameState.maxStreak = gameState.streak;

    let points = 100;
    const world = worlds[gameState.currentWorld - 1];
    const totalTime = world.timeLimit + gameState.bonusTime;
    if (timeUsed < totalTime * 0.3) points += 50;
    else if (timeUsed < totalTime * 0.6) points += 25;

    if (gameState.streak >= 3) points += 30 * Math.min(gameState.streak - 2, 5);

    points = Math.round(points * gameState.scoreMultiplier);
    gameState.score += points;

    document.getElementById('player-body').classList.add('attack');
    setTimeout(() => document.getElementById('player-body').classList.remove('attack'), 600);

    document.getElementById('enemy-body').classList.add('hit');
    setTimeout(() => document.getElementById('enemy-body').classList.remove('hit'), 500);

    gameState.enemyHP--;
    const hpPercent = Math.max(0, (gameState.enemyHP / gameState.enemyMaxHP) * 100);
    document.getElementById('enemy-hp').style.width = hpPercent + '%';

    if (gameState.streak >= 3) {
        showEffect(`🔥 ${gameState.streak} ต่อ! +${points}`, 'bonus-effect');
    } else {
        showEffect(`✓ ถูกต้อง! +${points}`, 'correct-effect');
    }

    updateHUD();

    setTimeout(() => {
        gameState.currentQuestion++;
        loadQuestion();
    }, 1200);
}

function onWrongAnswer() {
    gameState.streak = 0;
    gameState.lives--;

    document.getElementById('player-body').classList.add('hurt');
    setTimeout(() => document.getElementById('player-body').classList.remove('hurt'), 500);

    document.getElementById('enemy-body').classList.add('shake');
    setTimeout(() => document.getElementById('enemy-body').classList.remove('shake'), 500);

    showEffect('✗ ผิด! -❤️', 'wrong-effect');

    updateHUD();

    if (gameState.lives <= 0) {
        setTimeout(() => endWorld(false), 1200);
    } else {
        setTimeout(() => {
            gameState.currentQuestion++;
            loadQuestion();
        }, 1500);
    }
}

function useHint() {
    if (gameState.hints <= 0 || !gameState.isAnswering) return;
    gameState.hints--;
    document.getElementById('hints-left').textContent = gameState.hints;

    const answer = String(gameState.currentQuestionData.answer);
    const buttons = document.querySelectorAll('.answer-btn');
    let wrongBtns = [];
    buttons.forEach(b => {
        if (String(b.textContent) !== answer) wrongBtns.push(b);
    });

    shuffleArray(wrongBtns).slice(0, 2).forEach(b => {
        b.style.opacity = '0.2';
        b.disabled = true;
    });

    if (gameState.hints <= 0) {
        document.getElementById('hint-button').classList.add('disabled');
    }
}

// ===== TIMER =====
function startTimer(seconds) {
    gameState.timeLeft = seconds;
    gameState.maxTime = seconds;

    const timerFill = document.getElementById('timer-fill');
    timerFill.style.width = '100%';
    timerFill.className = 'timer-fill';

    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft -= 0.1;
        const percent = (gameState.timeLeft / gameState.maxTime) * 100;
        timerFill.style.width = Math.max(0, percent) + '%';

        if (percent < 20) {
            timerFill.className = 'timer-fill danger';
        } else if (percent < 50) {
            timerFill.className = 'timer-fill warning';
        }

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            onTimeUp();
        }
    }, 100);
}

function onTimeUp() {
    if (!gameState.isAnswering) return;
    gameState.isAnswering = false;

    gameState.streak = 0;
    gameState.lives--;

    const answer = String(gameState.currentQuestionData.answer);
    document.querySelectorAll('.answer-btn').forEach(b => {
        b.disabled = true;
        if (String(b.textContent) === answer) b.classList.add('correct');
    });

    showEffect('⏰ หมดเวลา! -❤️', 'wrong-effect');
    updateHUD();

    if (gameState.lives <= 0) {
        setTimeout(() => endWorld(false), 1200);
    } else {
        setTimeout(() => {
            gameState.currentQuestion++;
            loadQuestion();
        }, 1500);
    }
}

// ===== HUD UPDATE =====
function updateHUD() {
    const heartsEl = document.getElementById('hearts');
    let heartsHTML = '';
    for (let i = 0; i < gameState.maxLives; i++) {
        if (i < gameState.lives) {
            heartsHTML += '<span class="heart">❤️</span>';
        } else {
            heartsHTML += '<span class="heart lost">🖤</span>';
        }
    }
    heartsEl.innerHTML = heartsHTML;

    document.getElementById('streak-count').textContent = gameState.streak;
    document.getElementById('game-score').textContent = gameState.score;
    document.getElementById('hints-left').textContent = gameState.hints;

    if (gameState.hints <= 0) {
        document.getElementById('hint-button').classList.add('disabled');
    } else {
        document.getElementById('hint-button').classList.remove('disabled');
    }
}

// ===== EFFECTS =====
function showEffect(text, className) {
    const overlay = document.getElementById('effect-overlay');
    const textEl = document.getElementById('effect-text');
    textEl.textContent = text;
    textEl.className = 'effect-text ' + className;
    overlay.classList.remove('hidden');

    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 1000);
}

// ===== END WORLD =====
function endWorld(victory) {
    clearInterval(gameState.timerInterval);

    if (victory) {
        const accuracy = gameState.correctAnswers / gameState.totalQuestions;
        let worldStarCount = 1;
        if (accuracy >= 0.9) worldStarCount = 3;
        else if (accuracy >= 0.7) worldStarCount = 2;

        const wi = gameState.currentWorld - 1;
        if (worldStarCount > gameState.worldStars[wi]) {
            gameState.stars += (worldStarCount - gameState.worldStars[wi]);
            gameState.worldStars[wi] = worldStarCount;
        }

        gameState.totalScore += gameState.score;

        if (gameState.currentWorld < 5) {
            gameState.worldUnlocked[gameState.currentWorld] = true;
        }

        document.getElementById('v-score').textContent = gameState.score;
        document.getElementById('v-correct').textContent =
            `${gameState.correctAnswers}/${gameState.totalQuestions}`;
        document.getElementById('v-streak').textContent = gameState.maxStreak;

        const avgTime = gameState.correctAnswers > 0
            ? (gameState.totalTime / gameState.correctAnswers).toFixed(1)
            : '-';
        document.getElementById('v-time').textContent = avgTime + ' วินาที';

        const starsEl = document.getElementById('victory-stars');
        let starsHTML = '';
        for (let i = 0; i < 3; i++) {
            starsHTML += `<span class="big-star ${i < worldStarCount ? '' : 'empty'}">⭐</span>`;
        }
        starsEl.innerHTML = starsHTML;

        if (gameState.currentWorld >= 5) {
            document.getElementById('victory-title').textContent = '🎊 คุณชนะเกมแล้ว!';
        } else {
            document.getElementById('victory-title').textContent = '🎉 ผ่านด่านสำเร็จ!';
        }

        saveHighScore();
        showScreen('victory-screen');
    } else {
        document.getElementById('go-score').textContent = gameState.score;
        document.getElementById('go-correct').textContent = gameState.correctAnswers;
        showScreen('gameover-screen');
    }
}

function nextWorld() {
    if (gameState.currentWorld < 5) {
        gameState.currentWorld++;
        startGame();
    } else {
        updateMap();
        showScreen('map-screen');
    }
}

function retryWorld() {
    startGame();
}

// ===== HIGH SCORES =====
function saveHighScore() {
    const scores = JSON.parse(localStorage.getItem('mathAdventureScores') || '[]');
    scores.push({
        character: characters[gameState.character].name,
        score: gameState.totalScore,
        world: gameState.currentWorld,
        date: new Date().toLocaleDateString('th-TH'),
    });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('mathAdventureScores', JSON.stringify(scores.slice(0, 10)));
}

function renderHighScores() {
    const scores = JSON.parse(localStorage.getItem('mathAdventureScores') || '[]');
    const list = document.getElementById('scores-list');

    if (scores.length === 0) {
        list.innerHTML = '<p style="color:#8888cc;text-align:center;">ยังไม่มีคะแนน - เริ่มเล่นเลย!</p>';
        return;
    }

    list.innerHTML = scores.map((s, i) => `
        <div class="score-entry">
            <span class="score-rank">#${i + 1}</span>
            <span class="score-name">${s.character} (ด่าน ${s.world})</span>
            <span class="score-points">${s.score} คะแนน</span>
        </div>
    `).join('');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    showScreen('start-screen');
});
