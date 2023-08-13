const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span.time');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown = {};

// In miliseconds
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

// Set Date Input Min attribute with todays date
const [today, time] = new Date().toISOString().split("T");
dateEl.setAttribute("min", today)

// Populate Countdown and Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        const days = Math.floor(distance / DAY);
        const hours = Math.floor((distance % DAY) / HOUR)
        const minutes = Math.floor((distance % HOUR) / MINUTE)
        const seconds = Math.floor((distance % MINUTE) / SECOND)

        // Hide Input
        inputContainer.hidden = true;

        // If countdown has ended, show complete
        if (distance <= 0 ) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`
            completeEl.hidden = false;
        } else {
            // Populate Countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;

            // Show Countdown
            countdownEl.hidden = false;
        }
        
    }, SECOND)
}

// Take Values from Input Form
function updateCountdown(e) {
    e.preventDefault();
    const {target} = e;
    console.log(target[0].value);
    countdownTitle = target[0].value
    countdownDate = target[1].value;

    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };

    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    
    if (countdownDate === "") {
        alert('Please select a date for the countdown')
    } else {
        // Get number version of current Date, for DOM manipulation
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Reset All Values
function reset() {
    // Hide Countdowns, show Input
    countdownEl.hidden = true;
    inputContainer.hidden = false;
    completeEl.hidden = true
    // Reset Values and Clear Interval
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown')
    clearInterval(countdownActive);
}

function restorePreviousCOuntdown() {
    const countdown = JSON.parse(localStorage.getItem('countdown'));
    if (countdown) {
        inputContainer.hidden = false;
        savedCountdown = countdown;
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event Listiners 
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset)
completeBtn.addEventListener('click', reset)

// On load
restorePreviousCOuntdown();