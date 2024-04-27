const colors = ["yellow", "black", "purple", "blue", "white", "gray", "brown", "green", "red", "orange"];
const circleColor = document.getElementById("circle-color");
const scoreElement = document.getElementById("score");
const descriptionColor = document.getElementById("description-color");
const answerButton = document.getElementById("answer-button");
const transcriptElement = document.getElementById("transcript");
const scoreAnimation = document.getElementById("score-animation");
const successAudio = new Audio("assets/audio/success.mp3");
const failedAudio = new Audio("assets/audio/failed.mp3");
let recognition = null;
let disableAnswer = false;
let score = 0;
let color;

function sortColor() {
	const randomIndex = Math.floor(Math.random() * colors.length);
	color = colors[randomIndex];
	applyStyle(color);
	descriptionColor.innerText = color;
}

function applyStyle() {
	const borderColor = ["yellow", "white", "orange"].includes(color) ? "black" : "white";
	circleColor.style.border = `2px solid ${borderColor}`;
	circleColor.style.backgroundColor = color;
	descriptionColor.style.textShadow = `2px 0 ${borderColor}, -2px 0 ${borderColor}, 0 2px ${borderColor}, 0 -2px ${borderColor},
	1px 1px ${borderColor}, -1px -1px ${borderColor}, 1px -1px ${borderColor}, -1px 1px ${borderColor}`;
	descriptionColor.style.color = color;
}

function updateScore(points) {
	scoreAnimation.innerText = `${points < 0 ? "-" : "+"}${points} pts`;
	if (points > 0) {
		scoreAnimation.style.animationName = "popup-success";
		successAudio.play();
	} else {
		scoreAnimation.style.animationName = "popup-failed";
		failedAudio.play();
	}
	setTimeout(() => {
		scoreAnimation.style.animationName = "";
		transcriptElement.innerText = "";
		answerButton.style.opacity = 1;
		answerButton.style.cursor = "pointer";
		disableAnswer = false;
		sortColor();
	}, 3000);
	score += points;
	scoreElement.innerText = String(score).padStart(3, "0");
}

function listenAudio() {
	if (disableAnswer) return;
	recognition.start();
}

function configSpeechRecognition() {
	recognition = new webkitSpeechRecognition() || new SpeechRecognition();
	recognition.continuous = false;
	recognition.lang = "en-US";
	recognition.onstart = function () {
		answerButton.style.backgroundColor = "khaki";
		answerButton.innerText = "Listening...";
	}
	recognition.onend = function () {
		answerButton.style.backgroundColor = "white";
		answerButton.innerText = "Answer";
		recognition.stop();
	}
	recognition.onresult = function (event) {
		disableAnswer = true;
		answerButton.style.opacity = .5;
		answerButton.style.cursor = "not-allowed";
		let transcript = "";
		for (let i = event.resultIndex; i < event.results.length; ++i) {
			transcript += event.results[i][0].transcript;
		}
		transcriptElement.innerHTML = `You say: <strong>${transcript}</strong>`;
		const isColor = transcript.toLowerCase().includes(color);
		updateScore(isColor ? 10 : -20);
	}
}

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
	configSpeechRecognition();
} else {
	alert("Sorry! Browser not suported!");
}
sortColor();
