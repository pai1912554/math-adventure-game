// ===== FIREBASE CONFIG =====
const firebaseConfig = {
    apiKey: "AIzaSyBMTDJjJIncXHvDNGm3LoFsxEuEVgPNmfA",
    authDomain: "math-adventure-game-64889.firebaseapp.com",
    databaseURL: "https://math-adventure-game-64889-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "math-adventure-game-64889",
    storageBucket: "math-adventure-game-64889.firebasestorage.app",
    messagingSenderId: "1014244407246",
    appId: "1:1014244407246:web:828f1cecfd93ee609e5d9f",
    measurementId: "G-6XV4PBF9T6"
};

let db = null;
let firebaseReady = false;

function initFirebase() {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        firebaseReady = true;
        console.log('Firebase connected');
    } catch (e) {
        console.warn('Firebase not available, using local storage', e);
        firebaseReady = false;
    }
}

// ===== AVATARS =====
const avatarList = [
    '😊', '😎', '🤓', '🥳', '😺', '🐱',
    '🐶', '🦊', '🐼', '🐨', '🦁', '🐯',
    '🦄', '🐲', '🦋', '🌟', '🔥', '💎',
];

// ===== TITLES (ฉายา) =====
const titlesList = [
    { id: 'beginner', name: 'นักผจญภัยมือใหม่', icon: '🌱', condition: 'เริ่มเล่นเกม', minScore: 0 },
    { id: 'addsub', name: 'จ้าวแห่งบวกลบ', icon: '➕', condition: 'ผ่านด่าน 1', minWorld: 1 },
    { id: 'muldiv', name: 'ราชาสูตรคูณ', icon: '✖️', condition: 'ผ่านด่าน 2', minWorld: 2 },
    { id: 'fraction', name: 'เจ้าเศษส่วน', icon: '🔢', condition: 'ผ่านด่าน 3', minWorld: 3 },
    { id: 'mixed', name: 'จอมยุทธ์ตัวเลข', icon: '🌌', condition: 'ผ่านด่าน 4', minWorld: 4 },
    { id: 'master', name: 'จอมมารคณิตศาสตร์', icon: '👑', condition: 'ผ่านด่าน 5', minWorld: 5 },
    { id: 'streak5', name: 'คอมโบมาสเตอร์', icon: '🔥', condition: 'Streak 5 ขึ้นไป', minStreak: 5 },
    { id: 'streak10', name: 'เทพสายฟ้า', icon: '⚡', condition: 'Streak 10 ขึ้นไป', minStreak: 10 },
    { id: 'perfect', name: 'ไร้ที่ติ', icon: '💯', condition: 'ผ่านด่านตอบถูก 100%', needPerfect: true },
    { id: 'speed', name: 'สายฟ้าแลบ', icon: '💨', condition: 'เวลาเฉลี่ย < 5 วินาที', needSpeed: true },
    { id: 'top1', name: 'แชมป์อันดับ 1', icon: '🏆', condition: 'ติดอันดับ 1', needRank: 1 },
    { id: 'top3', name: 'นักรบ Top 3', icon: '🥇', condition: 'ติดอันดับ Top 3', needRank: 3 },
    { id: 'allstars', name: 'ดาวครบ 15', icon: '🌟', condition: 'สะสมดาวครบ 15', minStars: 15 },
    { id: 'score5k', name: 'เศรษฐีคะแนน', icon: '💰', condition: 'คะแนนรวม 5,000+', minScore: 5000 },
    { id: 'score10k', name: 'ตำนานตัวเลข', icon: '🏅', condition: 'คะแนนรวม 10,000+', minScore: 10000 },
];

// ===== FRAME TYPES =====
const frameTypes = {
    none: { name: 'ไม่มีกรอบ', class: 'frame-none' },
    bronze: { name: 'กรอบทองแดง', class: 'frame-bronze' },
    silver: { name: 'กรอบเงิน', class: 'frame-silver' },
    gold: { name: 'กรอบทอง', class: 'frame-gold' },
    diamond: { name: 'กรอบเพชร', class: 'frame-diamond' },
};

// ===== PLAYER DATA =====
let playerData = {
    name: '',
    classroom: '',
    studentNo: '',
    avatar: '😊',
    titles: ['beginner'],
    activeTitle: 'beginner',
    frame: 'none',
    totalScore: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestStreak: 0,
    worldsCleared: 0,
    totalStars: 0,
    gamesPlayed: 0,
    avgTime: 0,
};

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

let currentLBTab = 'score';

// ===== WORLD DATA =====
const worlds = [
    { id: 1, name: 'ป่าบวกลบ', scene: 'scene-forest', icon: '🌳', timeLimit: 20,
        enemies: [{ name: 'สไลม์เขียว', emoji: '🟢', hp: 2 },{ name: 'หมาป่าตัวเลข', emoji: '🐺', hp: 3 },{ name: 'ต้นไม้ปีศาจ', emoji: '🌲', hp: 3 },{ name: 'ผีเสื้อพิษ', emoji: '🦋', hp: 2 },{ name: 'บอสกอบลิน', emoji: '👹', hp: 5 }],
        generateQuestion: () => generateAddSubQuestion() },
    { id: 2, name: 'ภูเขาคูณหาร', scene: 'scene-mountain', icon: '🏔️', timeLimit: 25,
        enemies: [{ name: 'ค้างคาวหิน', emoji: '🦇', hp: 3 },{ name: 'โกเลมหิน', emoji: '🗿', hp: 4 },{ name: 'อินทรียักษ์', emoji: '🦅', hp: 3 },{ name: 'มังกรน้อย', emoji: '🐉', hp: 4 },{ name: 'บอสยักษ์ภูเขา', emoji: '👺', hp: 6 }],
        generateQuestion: () => generateMulDivQuestion() },
    { id: 3, name: 'ทะเลเศษส่วน', scene: 'scene-ocean', icon: '🌊', timeLimit: 30,
        enemies: [{ name: 'ปลาหมึกยักษ์', emoji: '🐙', hp: 3 },{ name: 'ฉลามตัวเลข', emoji: '🦈', hp: 4 },{ name: 'เงือกดำ', emoji: '🧜', hp: 4 },{ name: 'ปูยักษ์', emoji: '🦀', hp: 3 },{ name: 'บอสเจ้าสมุทร', emoji: '🐋', hp: 7 }],
        generateQuestion: () => generateFractionQuestion() },
    { id: 4, name: 'อวกาศตัวเลข', scene: 'scene-space', icon: '🌌', timeLimit: 25,
        enemies: [{ name: 'เอเลี่ยนสีเขียว', emoji: '👽', hp: 4 },{ name: 'หุ่นยนต์จักรกล', emoji: '🤖', hp: 5 },{ name: 'ดาวตกพิษ', emoji: '☄️', hp: 3 },{ name: 'จานบินปริศนา', emoji: '🛸', hp: 4 },{ name: 'บอสจอมจักรวาล', emoji: '🌑', hp: 8 }],
        generateQuestion: () => generateMixedQuestion() },
    { id: 5, name: 'ปราสาทโจทย์ปัญหา', scene: 'scene-castle', icon: '🏰', timeLimit: 35,
        enemies: [{ name: 'อัศวินเงา', emoji: '🗡️', hp: 5 },{ name: 'แม่มดตัวเลข', emoji: '🧙‍♀️', hp: 5 },{ name: 'มังกรไฟ', emoji: '🐲', hp: 6 },{ name: 'ยักษ์ปราสาท', emoji: '👾', hp: 5 },{ name: 'จอมมารคณิตศาสตร์', emoji: '😈', hp: 10 }],
        generateQuestion: () => generateWordProblem() },
];

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

function showHowTo() { showScreen('howto-screen'); }

function showRegister() {
    const saved = localStorage.getItem('mathGamePlayer');
    if (saved) {
        playerData = JSON.parse(saved);
        showProfileMini();
        showScreen('character-screen');
    } else {
        initAvatarGrid();
        showScreen('register-screen');
    }
}

function showLeaderboard() {
    loadLeaderboard();
    showScreen('leaderboard-screen');
}

// ===== AVATAR GRID =====
function initAvatarGrid() {
    const grid = document.getElementById('avatar-grid');
    grid.innerHTML = '';
    avatarList.forEach((av, i) => {
        const div = document.createElement('div');
        div.className = 'avatar-option' + (i === 0 ? ' selected' : '');
        div.textContent = av;
        div.onclick = () => {
            document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
            div.classList.add('selected');
            playerData.avatar = av;
        };
        grid.appendChild(div);
    });
}

// ===== REGISTER =====
function submitRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const classroom = document.getElementById('reg-class').value;
    const studentNo = document.getElementById('reg-number').value;

    if (!name || !classroom || !studentNo) return;

    playerData.name = name;
    playerData.classroom = classroom;
    playerData.studentNo = studentNo;
    playerData.titles = ['beginner'];
    playerData.activeTitle = 'beginner';
    playerData.frame = 'none';
    playerData.totalScore = 0;
    playerData.totalCorrect = 0;
    playerData.totalQuestions = 0;
    playerData.bestStreak = 0;
    playerData.worldsCleared = 0;
    playerData.totalStars = 0;
    playerData.gamesPlayed = 0;

    localStorage.setItem('mathGamePlayer', JSON.stringify(playerData));

    showProfileMini();
    showScreen('character-screen');
}

function showProfileMini() {
    const el = document.getElementById('profile-mini-char');
    if (el) {
        const t = titlesList.find(t => t.id === playerData.activeTitle);
        el.innerHTML = `${playerData.avatar} ${playerData.name} (${playerData.classroom} เลขที่ ${playerData.studentNo}) <span style="color:#FFD700;">${t ? t.icon + ' ' + t.name : ''}</span>`;
    }
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
        const lockEl = node.querySelector('.lock-overlay');
        if (!gameState.worldUnlocked[i - 1]) {
            node.classList.add('locked');
            if (lockEl) lockEl.style.display = 'block';
        } else {
            if (lockEl) lockEl.style.display = 'none';
            if (gameState.worldStars[i - 1] > 0) node.classList.add('completed');
            else node.classList.add('current');
        }
        const ws = gameState.worldStars[i - 1];
        let starStr = '';
        for (let s = 0; s < 3; s++) starStr += s < ws ? '★' : '☆';
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
    const op = ['+', '-'][Math.floor(Math.random() * 2)];
    let a, b, answer;
    if (op === '+') { a = randInt(1, 50); b = randInt(1, 50); answer = a + b; }
    else { a = randInt(10, 99); b = randInt(1, a); answer = a - b; }
    return { text: `${a} ${op} ${b} = ?`, answer, choices: generateChoices(answer, 0, 100) };
}

function generateMulDivQuestion() {
    const op = ['×', '÷'][Math.floor(Math.random() * 2)];
    let a, b, answer;
    if (op === '×') { a = randInt(2, 12); b = randInt(2, 12); answer = a * b; }
    else { b = randInt(2, 12); answer = randInt(1, 12); a = b * answer; }
    return { text: `${a} ${op} ${b} = ?`, answer, choices: generateChoices(answer, 1, 150) };
}

function generateFractionQuestion() {
    const types = ['simplify', 'add', 'compare'];
    const type = types[Math.floor(Math.random() * types.length)];
    if (type === 'simplify') {
        const base = randInt(1, 6), mult = randInt(2, 5);
        const num = base * mult, den = randInt(base + 1, 10) * mult;
        const gcd = getGCD(num, den);
        const answer = `${num/gcd}/${den/gcd}`;
        const wrong = [];
        while (wrong.length < 3) { const w = `${randInt(1,8)}/${randInt(2,10)}`; if (w !== answer && !wrong.includes(w)) wrong.push(w); }
        return { text: `ทำให้เป็นเศษส่วนอย่างต่ำ: ${num}/${den} = ?`, answer, choices: shuffleArray([answer, ...wrong]), isText: true };
    } else if (type === 'add') {
        const den = [2,3,4,5,6,8,10][Math.floor(Math.random()*7)];
        const a = randInt(1, den-1), b = randInt(1, den-1), sumNum = a+b, gcd = getGCD(sumNum, den);
        let ans;
        if (sumNum/gcd >= den/gcd) { const w = Math.floor((sumNum/gcd)/(den/gcd)), r = (sumNum/gcd)%(den/gcd); ans = r===0 ? `${w}` : `${w} ${r}/${den/gcd}`; }
        else ans = `${sumNum/gcd}/${den/gcd}`;
        const wrong = [];
        while (wrong.length < 3) { const w = `${randInt(1,10)}/${randInt(2,10)}`; if (w !== ans && !wrong.includes(w)) wrong.push(w); }
        return { text: `${a}/${den} + ${b}/${den} = ?`, answer: ans, choices: shuffleArray([ans, ...wrong]), isText: true };
    } else {
        const an = randInt(1,5), ad = randInt(2,8);
        let bn, bd; do { bn = randInt(1,5); bd = randInt(2,8); } while (an/ad === bn/bd);
        const answer = an/ad > bn/bd ? '>' : '<';
        return { text: `${an}/${ad} __ ${bn}/${bd}\nเลือกเครื่องหมายที่ถูกต้อง`, answer, choices: shuffleArray(['>','<','=','≠']), isText: true };
    }
}

function generateMixedQuestion() {
    const types = ['order','missing','twoStep'];
    const type = types[Math.floor(Math.random()*types.length)];
    if (type === 'order') { const a=randInt(2,9),b=randInt(2,9),c=randInt(1,20),answer=a*b+c; return { text:`${a} × ${b} + ${c} = ?`, answer, choices:generateChoices(answer,1,100) }; }
    else if (type === 'missing') { const a=randInt(5,30),answer=randInt(3,20),r=a+answer; return { text:`${a} + ? = ${r}`, answer, choices:generateChoices(answer,1,50) }; }
    else { const a=randInt(10,50),b=randInt(2,10),c=randInt(1,10),answer=a-b*c; return { text:`${a} - ${b} × ${c} = ?`, answer, choices:generateChoices(answer,-20,60) }; }
}

function generateWordProblem() {
    const problems = [
        () => { const items=['แอปเปิ้ล','ส้ม','กล้วย','มะม่วง'],item=items[randInt(0,3)],a=randInt(10,30),b=randInt(5,a-1),c=randInt(1,10),answer=a-b+c; return { text:`มี${item} ${a} ผล แจกไป ${b} ผล ซื้อเพิ่ม ${c} ผล เหลือกี่ผล?`, answer, choices:generateChoices(answer,1,50) }; },
        () => { const p=randInt(10,50),q=randInt(2,8),answer=p*q; return { text:`ปากกาด้ามละ ${p} บาท ซื้อ ${q} ด้าม จ่ายกี่บาท?`, answer, choices:generateChoices(answer,10,400) }; },
        () => { const g=randInt(2,10),answer=randInt(2,12),t=answer*g; return { text:`แบ่งขนม ${t} ชิ้น ให้เด็ก ${g} คน ได้คนละกี่ชิ้น?`, answer, choices:generateChoices(answer,1,50) }; },
        () => { const l=randInt(5,20),w=randInt(3,15),answer=l*w; return { text:`สนามยาว ${l} ม. กว้าง ${w} ม. พื้นที่กี่ ตร.ม.?`, answer, choices:generateChoices(answer,10,300) }; },
        () => { const p=randInt(2,8)*4,answer=p/4; return { text:`สี่เหลี่ยมจัตุรัสเส้นรอบรูป ${p} ซม. ด้านยาวกี่ซม.?`, answer, choices:generateChoices(answer,1,20) }; },
        () => { const m=randInt(50,200),s=randInt(10,m-10),answer=m-s; return { text:`มีเงิน ${m} บาท ซื้อของ ${s} บาท เหลือกี่บาท?`, answer, choices:generateChoices(answer,1,200) }; },
        () => { const r=randInt(3,8),c=randInt(3,8),answer=r*c; return { text:`ปลูกต้นไม้ ${r} แถว แถวละ ${c} ต้น มีกี่ต้น?`, answer, choices:generateChoices(answer,5,70) }; },
    ];
    return problems[randInt(0, problems.length-1)]();
}

// ===== UTILITY =====
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function generateChoices(answer, min, max) {
    const c = [answer];
    while (c.length < 4) { const d = Math.max(1, Math.floor(Math.abs(answer)*0.5)); let w = answer + randInt(-d-3, d+3); if (w < min) w = randInt(min, max); if (w !== answer && !c.includes(w)) c.push(w); }
    return shuffleArray(c);
}
function shuffleArray(arr) { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function getGCD(a, b) { a=Math.abs(a); b=Math.abs(b); while(b){[a,b]=[b,a%b];} return a; }

// ===== GAME LOGIC =====
function startGame() {
    const world = worlds[gameState.currentWorld - 1];
    gameState.currentQuestion = 0; gameState.score = 0; gameState.lives = gameState.maxLives;
    gameState.streak = 0; gameState.maxStreak = 0; gameState.correctAnswers = 0;
    gameState.totalTime = 0; gameState.isAnswering = false;
    document.getElementById('scene-bg').className = world.scene;
    document.getElementById('world-name').textContent = world.icon + ' ' + world.name;
    document.getElementById('player-body').textContent = characters[gameState.character].emoji;
    updateHUD(); showScreen('game-screen'); loadQuestion();
}

function loadQuestion() {
    if (gameState.currentQuestion >= gameState.totalQuestions) { endWorld(true); return; }
    const world = worlds[gameState.currentWorld - 1];
    const question = world.generateQuestion();
    gameState.currentQuestionData = question; gameState.isAnswering = true;
    const enemyIdx = Math.min(Math.floor(gameState.currentQuestion / 2), world.enemies.length - 1);
    const enemy = world.enemies[enemyIdx];
    gameState.enemyMaxHP = enemy.hp; gameState.enemyHP = enemy.hp;
    document.getElementById('enemy-body').textContent = enemy.emoji;
    document.getElementById('enemy-name').textContent = enemy.name;
    document.getElementById('enemy-hp').style.width = '100%';
    document.getElementById('question-progress').textContent = `ข้อ ${gameState.currentQuestion + 1}/${gameState.totalQuestions}`;
    document.getElementById('question-text').textContent = question.text;
    const grid = document.getElementById('answers-grid'); grid.innerHTML = '';
    question.choices.forEach(choice => {
        const btn = document.createElement('button'); btn.className = 'answer-btn'; btn.textContent = choice;
        btn.onclick = () => checkAnswer(choice, btn); grid.appendChild(btn);
    });
    startTimer(world.timeLimit + gameState.bonusTime);
}

function checkAnswer(selected, btnEl) {
    if (!gameState.isAnswering) return; gameState.isAnswering = false;
    clearInterval(gameState.timerInterval);
    const timeUsed = (worlds[gameState.currentWorld-1].timeLimit + gameState.bonusTime) - gameState.timeLeft;
    gameState.totalTime += timeUsed;
    const correct = String(selected) === String(gameState.currentQuestionData.answer);
    document.querySelectorAll('.answer-btn').forEach(b => { b.disabled = true; if (String(b.textContent) === String(gameState.currentQuestionData.answer)) b.classList.add('correct'); });
    if (correct) { btnEl.classList.add('correct'); onCorrectAnswer(timeUsed); }
    else { btnEl.classList.add('wrong'); onWrongAnswer(); }
}

function onCorrectAnswer(timeUsed) {
    gameState.correctAnswers++; gameState.streak++;
    if (gameState.streak > gameState.maxStreak) gameState.maxStreak = gameState.streak;
    let points = 100;
    const totalTime = worlds[gameState.currentWorld-1].timeLimit + gameState.bonusTime;
    if (timeUsed < totalTime * 0.3) points += 50; else if (timeUsed < totalTime * 0.6) points += 25;
    if (gameState.streak >= 3) points += 30 * Math.min(gameState.streak - 2, 5);
    points = Math.round(points * gameState.scoreMultiplier); gameState.score += points;
    document.getElementById('player-body').classList.add('attack');
    setTimeout(() => document.getElementById('player-body').classList.remove('attack'), 600);
    document.getElementById('enemy-body').classList.add('hit');
    setTimeout(() => document.getElementById('enemy-body').classList.remove('hit'), 500);
    gameState.enemyHP--;
    document.getElementById('enemy-hp').style.width = Math.max(0, (gameState.enemyHP / gameState.enemyMaxHP) * 100) + '%';
    if (gameState.streak >= 3) showEffect(`🔥 ${gameState.streak} ต่อ! +${points}`, 'bonus-effect');
    else showEffect(`✓ ถูกต้อง! +${points}`, 'correct-effect');
    updateHUD();
    setTimeout(() => { gameState.currentQuestion++; loadQuestion(); }, 1200);
}

function onWrongAnswer() {
    gameState.streak = 0; gameState.lives--;
    document.getElementById('player-body').classList.add('hurt');
    setTimeout(() => document.getElementById('player-body').classList.remove('hurt'), 500);
    document.getElementById('enemy-body').classList.add('shake');
    setTimeout(() => document.getElementById('enemy-body').classList.remove('shake'), 500);
    showEffect('✗ ผิด! -❤️', 'wrong-effect'); updateHUD();
    if (gameState.lives <= 0) setTimeout(() => endWorld(false), 1200);
    else setTimeout(() => { gameState.currentQuestion++; loadQuestion(); }, 1500);
}

function useHint() {
    if (gameState.hints <= 0 || !gameState.isAnswering) return; gameState.hints--;
    document.getElementById('hints-left').textContent = gameState.hints;
    const answer = String(gameState.currentQuestionData.answer);
    let wrongBtns = [];
    document.querySelectorAll('.answer-btn').forEach(b => { if (String(b.textContent) !== answer) wrongBtns.push(b); });
    shuffleArray(wrongBtns).slice(0, 2).forEach(b => { b.style.opacity = '0.2'; b.disabled = true; });
    if (gameState.hints <= 0) document.getElementById('hint-button').classList.add('disabled');
}

function startTimer(seconds) {
    gameState.timeLeft = seconds; gameState.maxTime = seconds;
    const timerFill = document.getElementById('timer-fill'); timerFill.style.width = '100%'; timerFill.className = 'timer-fill';
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft -= 0.1;
        const percent = (gameState.timeLeft / gameState.maxTime) * 100;
        timerFill.style.width = Math.max(0, percent) + '%';
        if (percent < 20) timerFill.className = 'timer-fill danger';
        else if (percent < 50) timerFill.className = 'timer-fill warning';
        if (gameState.timeLeft <= 0) { clearInterval(gameState.timerInterval); onTimeUp(); }
    }, 100);
}

function onTimeUp() {
    if (!gameState.isAnswering) return; gameState.isAnswering = false;
    gameState.streak = 0; gameState.lives--;
    document.querySelectorAll('.answer-btn').forEach(b => { b.disabled = true; if (String(b.textContent) === String(gameState.currentQuestionData.answer)) b.classList.add('correct'); });
    showEffect('⏰ หมดเวลา! -❤️', 'wrong-effect'); updateHUD();
    if (gameState.lives <= 0) setTimeout(() => endWorld(false), 1200);
    else setTimeout(() => { gameState.currentQuestion++; loadQuestion(); }, 1500);
}

function updateHUD() {
    let heartsHTML = '';
    for (let i = 0; i < gameState.maxLives; i++) heartsHTML += i < gameState.lives ? '<span class="heart">❤️</span>' : '<span class="heart lost">🖤</span>';
    document.getElementById('hearts').innerHTML = heartsHTML;
    document.getElementById('streak-count').textContent = gameState.streak;
    document.getElementById('game-score').textContent = gameState.score;
    document.getElementById('hints-left').textContent = gameState.hints;
    if (gameState.hints <= 0) document.getElementById('hint-button').classList.add('disabled');
    else document.getElementById('hint-button').classList.remove('disabled');
}

function showEffect(text, className) {
    const overlay = document.getElementById('effect-overlay');
    const textEl = document.getElementById('effect-text');
    textEl.textContent = text; textEl.className = 'effect-text ' + className;
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('hidden'), 1000);
}

// ===== END WORLD =====
function endWorld(victory) {
    clearInterval(gameState.timerInterval);
    if (victory) {
        const accuracy = gameState.correctAnswers / gameState.totalQuestions;
        let worldStarCount = 1;
        if (accuracy >= 0.9) worldStarCount = 3; else if (accuracy >= 0.7) worldStarCount = 2;
        const wi = gameState.currentWorld - 1;
        if (worldStarCount > gameState.worldStars[wi]) { gameState.stars += (worldStarCount - gameState.worldStars[wi]); gameState.worldStars[wi] = worldStarCount; }
        gameState.totalScore += gameState.score;
        if (gameState.currentWorld < 5) gameState.worldUnlocked[gameState.currentWorld] = true;

        // Update player data
        playerData.totalScore += gameState.score;
        playerData.totalCorrect += gameState.correctAnswers;
        playerData.totalQuestions += gameState.totalQuestions;
        playerData.totalStars = gameState.stars;
        if (gameState.maxStreak > playerData.bestStreak) playerData.bestStreak = gameState.maxStreak;
        if (gameState.currentWorld > playerData.worldsCleared) playerData.worldsCleared = gameState.currentWorld;
        playerData.gamesPlayed++;
        const avgT = gameState.correctAnswers > 0 ? gameState.totalTime / gameState.correctAnswers : 99;
        playerData.avgTime = avgT;

        // Check titles
        checkAndAwardTitles(accuracy, avgT);

        // Determine frame based on total score
        if (playerData.totalScore >= 10000) playerData.frame = 'diamond';
        else if (playerData.totalScore >= 5000) playerData.frame = 'gold';
        else if (playerData.totalScore >= 2000) playerData.frame = 'silver';
        else if (playerData.totalScore >= 500) playerData.frame = 'bronze';

        localStorage.setItem('mathGamePlayer', JSON.stringify(playerData));

        // Save to Firebase
        saveToFirebase();

        // Show victory screen
        document.getElementById('v-score').textContent = gameState.score;
        document.getElementById('v-correct').textContent = `${gameState.correctAnswers}/${gameState.totalQuestions}`;
        document.getElementById('v-streak').textContent = gameState.maxStreak;
        document.getElementById('v-time').textContent = (avgT < 99 ? avgT.toFixed(1) : '-') + ' วินาที';
        const starsEl = document.getElementById('victory-stars');
        let starsHTML = '';
        for (let i = 0; i < 3; i++) starsHTML += `<span class="big-star ${i < worldStarCount ? '' : 'empty'}">⭐</span>`;
        starsEl.innerHTML = starsHTML;
        document.getElementById('victory-title').textContent = gameState.currentWorld >= 5 ? '🎊 คุณชนะเกมแล้ว!' : '🎉 ผ่านด่านสำเร็จ!';

        // Show earned title
        const latestTitle = playerData.titles[playerData.titles.length - 1];
        const titleData = titlesList.find(t => t.id === latestTitle);
        if (titleData) {
            document.getElementById('victory-title-earned').style.display = 'block';
            document.getElementById('earned-title-badge').textContent = `${titleData.icon} ฉายา: ${titleData.name}`;
        }

        showScreen('victory-screen');
    } else {
        document.getElementById('go-score').textContent = gameState.score;
        document.getElementById('go-correct').textContent = gameState.correctAnswers;
        showScreen('gameover-screen');
    }
}

function nextWorld() {
    if (gameState.currentWorld < 5) { gameState.currentWorld++; startGame(); }
    else { updateMap(); showScreen('map-screen'); }
}
function retryWorld() { startGame(); }

// ===== TITLES SYSTEM =====
function checkAndAwardTitles(accuracy, avgTime) {
    const p = playerData;
    titlesList.forEach(t => {
        if (p.titles.includes(t.id)) return;
        let earned = false;
        if (t.minWorld && p.worldsCleared >= t.minWorld) earned = true;
        if (t.minStreak && p.bestStreak >= t.minStreak) earned = true;
        if (t.minScore && p.totalScore >= t.minScore) earned = true;
        if (t.minStars && p.totalStars >= t.minStars) earned = true;
        if (t.needPerfect && accuracy >= 1.0) earned = true;
        if (t.needSpeed && avgTime < 5 && avgTime > 0) earned = true;
        if (earned) { p.titles.push(t.id); p.activeTitle = t.id; }
    });
}

// ===== FIREBASE SAVE =====
function saveToFirebase() {
    if (!firebaseReady || !db) {
        saveToLocalLeaderboard();
        return;
    }
    const key = `${playerData.classroom}_${playerData.studentNo}_${playerData.name}`.replace(/[.#$/\[\]]/g, '_');
    const data = {
        name: playerData.name,
        classroom: playerData.classroom,
        studentNo: playerData.studentNo,
        avatar: playerData.avatar,
        frame: playerData.frame,
        activeTitle: playerData.activeTitle,
        totalScore: playerData.totalScore,
        totalCorrect: playerData.totalCorrect,
        totalQuestions: playerData.totalQuestions,
        bestStreak: playerData.bestStreak,
        worldsCleared: playerData.worldsCleared,
        totalStars: playerData.totalStars,
        avgTime: playerData.avgTime || 99,
        accuracy: playerData.totalQuestions > 0 ? Math.round((playerData.totalCorrect / playerData.totalQuestions) * 100) : 0,
        updatedAt: Date.now(),
    };
    db.ref('leaderboard/' + key).set(data).catch(() => saveToLocalLeaderboard());
}

function saveToLocalLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('mathAdventureScores') || '[]');
    const existing = scores.findIndex(s => s.name === playerData.name && s.classroom === playerData.classroom);
    const entry = {
        name: playerData.name, classroom: playerData.classroom, studentNo: playerData.studentNo,
        avatar: playerData.avatar, frame: playerData.frame, activeTitle: playerData.activeTitle,
        totalScore: playerData.totalScore, accuracy: playerData.totalQuestions > 0 ? Math.round((playerData.totalCorrect / playerData.totalQuestions) * 100) : 0,
        avgTime: playerData.avgTime || 99, bestStreak: playerData.bestStreak, worldsCleared: playerData.worldsCleared,
    };
    if (existing >= 0) scores[existing] = entry; else scores.push(entry);
    scores.sort((a, b) => b.totalScore - a.totalScore);
    localStorage.setItem('mathAdventureScores', JSON.stringify(scores.slice(0, 50)));
}

// ===== LEADERBOARD =====
function switchLBTab(tab, btn) {
    currentLBTab = tab;
    document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    loadLeaderboard();
}

function loadLeaderboard() {
    const classFilter = document.getElementById('lb-class-filter')?.value || 'all';

    if (firebaseReady && db) {
        db.ref('leaderboard').orderByChild('totalScore').once('value', snap => {
            let entries = [];
            snap.forEach(child => { entries.push(child.val()); });
            entries.reverse();
            if (classFilter !== 'all') entries = entries.filter(e => e.classroom === classFilter);
            sortEntries(entries);
            renderLeaderboard(entries);
        }).catch(() => loadLocalLeaderboard(classFilter));
    } else {
        loadLocalLeaderboard(classFilter);
    }
}

function loadLocalLeaderboard(classFilter) {
    let entries = JSON.parse(localStorage.getItem('mathAdventureScores') || '[]');
    if (classFilter && classFilter !== 'all') entries = entries.filter(e => e.classroom === classFilter);
    sortEntries(entries);
    renderLeaderboard(entries);
}

function sortEntries(entries) {
    if (currentLBTab === 'score') entries.sort((a, b) => b.totalScore - a.totalScore);
    else if (currentLBTab === 'accuracy') entries.sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0));
    else if (currentLBTab === 'speed') entries.sort((a, b) => (a.avgTime || 99) - (b.avgTime || 99));
}

function renderLeaderboard(entries) {
    // Podium Top 3
    for (let i = 1; i <= 3; i++) {
        const e = entries[i - 1];
        const av = document.getElementById(`pod${i}-avatar`);
        const nm = document.getElementById(`pod${i}-name`);
        const sc = document.getElementById(`pod${i}-score`);
        if (e) {
            const frameClass = frameTypes[e.frame || 'none']?.class || 'frame-none';
            av.textContent = e.avatar || '😊';
            av.className = `podium-avatar ${frameClass}`;
            nm.textContent = e.name || '-';
            if (currentLBTab === 'score') sc.textContent = (e.totalScore || 0) + ' คะแนน';
            else if (currentLBTab === 'accuracy') sc.textContent = (e.accuracy || 0) + '%';
            else sc.textContent = (e.avgTime ? e.avgTime.toFixed(1) : '-') + ' วิ';
        } else {
            av.textContent = '-'; av.className = 'podium-avatar frame-none';
            nm.textContent = '-'; sc.textContent = '-';
        }
    }

    // List 4-10
    const list = document.getElementById('lb-list');
    if (entries.length <= 3) { list.innerHTML = ''; return; }
    list.innerHTML = entries.slice(3, 10).map((e, i) => {
        const rank = i + 4;
        const frameClass = frameTypes[e.frame || 'none']?.class || 'frame-none';
        const titleData = titlesList.find(t => t.id === e.activeTitle);
        let scoreText = '';
        if (currentLBTab === 'score') scoreText = (e.totalScore || 0) + ' คะแนน';
        else if (currentLBTab === 'accuracy') scoreText = (e.accuracy || 0) + '%';
        else scoreText = (e.avgTime ? e.avgTime.toFixed(1) : '-') + ' วิ';
        return `<div class="lb-entry">
            <div class="lb-rank">#${rank}</div>
            <div class="lb-avatar-small ${frameClass}">${e.avatar || '😊'}</div>
            <div class="lb-info">
                <div class="lb-name">${e.name}</div>
                <div class="lb-class">${e.classroom} เลขที่ ${e.studentNo}</div>
                ${titleData ? `<div class="lb-title-small">${titleData.icon} ${titleData.name}</div>` : ''}
            </div>
            <div class="lb-score-val">${scoreText}</div>
        </div>`;
    }).join('');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    showScreen('start-screen');
});
