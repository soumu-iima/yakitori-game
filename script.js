let step = 1;
let score = 0;
let miss = 0;
let timeLeft = 30;
let gameOver = false;
let timer = null;

const successSound = new Audio("sounds/success.mp3");
const missSound = new Audio("sounds/miss.mp3");
const completeSound = new Audio("sounds/complete.mp3");

const steps = [
    "",
    "モモ肉を串に刺す",
    "タレをつける",
    "炭火へ置く",
    "裏返す",
    "もう一度タレをつける",
    "お客様へ提供する"
];

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("showResultButton").addEventListener("click", showResultScreen);

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    document.getElementById("finishScreen").style.display = "none";
    document.getElementById("resultScreen").style.display = "none";

    updateScreen();

    timer = setInterval(function () {
        if (gameOver) return;

        timeLeft--;
        document.getElementById("timeText").textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function playGame(selectedStep) {
    if (gameOver) return;

    if (selectedStep === step) {
        step++;

        if (step > 6) {
            score++;
            playSound(completeSound);
            showMessage("完成！次の焼き鳥へ！", "green");
            step = 1;
        } else {
            playSound(successSound);
            showMessage("成功！", "green");
        }
    } else {
        miss++;
        timeLeft = timeLeft - 5;

        if (timeLeft < 0) {
            timeLeft = 0;
        }

        document.getElementById("timeText").textContent = timeLeft;

        playSound(missSound);
        showMessage("順番が違います！ 残り時間 -5秒", "red");

        if (timeLeft <= 0) {
            endGame();
            return;
        }
    }

    updateScreen();
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function updateScreen() {
    document.getElementById("stepText").textContent = steps[step];
    document.getElementById("scoreText").textContent = score;
    document.getElementById("missText").textContent = miss;
}

function showMessage(message, color) {
    const msg = document.getElementById("messageText");
    msg.textContent = message;
    msg.style.color = color;
}

function endGame() {
    gameOver = true;

    if (timer !== null) {
        clearInterval(timer);
    }

    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("finishScreen").style.display = "block";
}

function showResultScreen() {
    document.getElementById("finishScreen").style.display = "none";
    document.getElementById("resultScreen").style.display = "block";

    showResult();
}

function showResult() {
    let rank = "";
    let comment = "";
    let missComment = "";
    let bestMessage = "";

    let bestScore = localStorage.getItem("yakitoriBestScore");

    if (bestScore === null) {
        bestScore = 0;
    } else {
        bestScore = Number(bestScore);
    }

    if (score > bestScore) {
        localStorage.setItem("yakitoriBestScore", score);
        bestScore = score;
        bestMessage = "🎉 自己ベスト更新！";
    } else {
        bestMessage = "自己ベスト：" + bestScore + "本";
    }

    if (score >= 15) {
        rank = "レジェンド級";
        comment = "圧倒的なスピードと正確性を兼ね備えています。まさに焼き職人の達人です。";
    } else if (score >= 12) {
        rank = "プロ級";
        comment = "高い技術と安定感を持っています。焼き職人として頼もしい存在です。";
    } else if (score >= 8) {
        rank = "営業所長候補";
        comment = "素早い判断と安定した手順で、高い成果を出せるタイプです。";
    } else if (score >= 5) {
        rank = "リーダー候補";
        comment = "周囲を引っ張る力があります。経験を積めばさらに成長できます。";
    } else if (score >= 3) {
        rank = "期待のホープ";
        comment = "基本をしっかり身につけています。今後の成長が楽しみです。";
    } else if (score >= 2) {
        rank = "ルーキー";
        comment = "少しずつコツをつかめています。まずは一歩ずつ前進です。";
    } else {
        rank = "駆け出し新人";
        comment = "これからがスタートです。何事も挑戦することが成長につながります。";
    }

    if (miss === 0) {
        missComment = "ミスなく進められました。正確性も高く、安定した仕事が期待できます。";
    } else if (miss <= 2) {
        missComment = "ミスは少なめです。落ち着いて手順を確認できています。";
    } else if (miss <= 5) {
        missComment = "スピード感はあります。次は正確性をさらに意識してみましょう。";
    } else {
        missComment = "スピードも大切ですが、それ以上にていねいさも大切です。もう一回挑戦してみませんか？";
    }

    document.getElementById("resultText").innerHTML =
        "<h2>" + rank + "</h2>" +
        "<p>完成本数：" + score + "本</p>" +
        "<p>ミス：" + miss + "回</p>" +
        "<p>" + bestMessage + "</p>" +
        "<p>" + comment + "</p>" +
        "<p>" + missComment + "</p>" +
        "<p>当社は「笑顔のみなもとであり続けます」を、企業理念としている会社です。</p>" +
        "<p>竜鳳のやきとりを通じてあなたもお客様を笑顔にする側の一員として活躍してみませんか？</p>";
}