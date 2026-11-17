// Default to 10 minutes (600 seconds)
let defaultSeconds = 600;
let totalSeconds = defaultSeconds;
let timerInterval = null;
let isRunning = false;

let scores = { home: 0, away: 0 };
let period = 1;

const timerDisplay = document.getElementById("timer-display");
const startStopBtn = document.getElementById("start-stop-btn");
const periodDisplay = document.getElementById("period");
const lengthSelect = document.getElementById("period-length");

function updateTimerDisplay() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function changeTimerLength() {
    defaultSeconds = parseInt(lengthSelect.value, 10);
    resetTimer();
}

function stopAllAudio() {
    const sounds = ["round-horn-audio", "home-goal-audio", "away-goal-audio"];
    sounds.forEach(id => {
        const audio = document.getElementById(id);
        audio.pause();
        audio.currentTime = 0;
    });
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        startStopBtn.textContent = "START";
        startStopBtn.classList.remove("running");
        isRunning = false;
    } else {
        if (totalSeconds <= 0) return;
        timerInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                startStopBtn.textContent = "START";
                startStopBtn.classList.remove("running");
                
                // Play end-of-round horn
                stopAllAudio();
                const roundHorn = document.getElementById("round-horn-audio");
                roundHorn.play().catch(e => console.log("Audio play blocked:", e));
            }
        }, 1000);
        startStopBtn.textContent = "STOP";
        startStopBtn.classList.add("running");
        isRunning = true;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    totalSeconds = defaultSeconds;
    updateTimerDisplay();
    startStopBtn.textContent = "START";
    startStopBtn.classList.remove("running");
    stopAllAudio();
}

function changePeriod() {
    period++;
    if (period > 3) period = 1;
    periodDisplay.textContent = period;
    resetTimer();
}

function adjustScore(team, amount) {
    scores[team] = Math.max(0, scores[team] + amount);
    document.getElementById(`${team}-score`).textContent = scores[team];
}

function triggerGoal(team) {
    adjustScore(team, 1);

    // Stop any currently playing sound and play the team's specific goal audio
    stopAllAudio();
    const goalAudio = document.getElementById(`${team}-goal-audio`);
    goalAudio.play().catch(e => console.log("Audio play blocked:", e));
}

// Initialize display
updateTimerDisplay();