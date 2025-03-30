// Counter functionality
let count = 0;

function incrementCounter() {
    count += 1;
    document.getElementById('counter').textContent = count;
}

function decrementCounter() {
    count -= 1;
    document.getElementById('counter').textContent = count;
}

// Text input functionality
function showText() {
    const inputText = document.getElementById('textInput').value;
    document.getElementById('outputText').textContent = inputText;
    document.getElementById('textInput').value = ''; // Clear the input
}

// User Data
let userData = {
    streak: 0,
    points: 0,
    badges: [],
    moodHistory: [],
    contacts: [],
    lastCheckIn: null,
    moodNotes: {} // Store notes for each mood entry
};

// Daily Challenges
const challenges = [
    {
        text: "Go vape-free for 24 hours",
        type: "general"
    },
    {
        text: "Try a new hobby for 10 minutes",
        type: "general"
    },
    {
        text: "Practice basic breathing exercise",
        type: "breathing",
        pattern: "basic"
    },
    {
        text: "Try calming breath technique",
        type: "breathing",
        pattern: "calming"
    },
    {
        text: "Do energizing breathing exercise",
        type: "breathing",
        pattern: "energizing"
    },
    {
        text: "Drink water instead of vaping",
        type: "general"
    },
    {
        text: "Share your progress with a friend",
        type: "general"
    },
    {
        text: "Do a quick workout when you feel cravings",
        type: "general"
    }
];

// Mood colors
const moodColors = {
    great: '#4CAF50',
    good: '#8BC34A',
    okay: '#FFC107',
    bad: '#FF9800',
    terrible: '#F44336'
};

// Breathing exercise state
let breathingExercise = {
    isActive: false,
    currentPhase: 'inhale',
    breaths: 0,
    maxBreaths: 5
};

// Breathing exercise variations
const breathingPatterns = {
    basic: {
        name: "Basic Breathing",
        inhale: 4,
        exhale: 4,
        breaths: 5,
        description: "Simple 4-4 breathing pattern"
    },
    calming: {
        name: "Calming Breath",
        inhale: 4,
        hold: 4,
        exhale: 8,
        breaths: 4,
        description: "4-4-8 pattern for deep relaxation"
    },
    energizing: {
        name: "Energizing Breath",
        inhale: 2,
        exhale: 2,
        breaths: 8,
        description: "Quick 2-2 pattern for energy"
    }
};

// Badges
const badges = [
    { id: 'first_day', name: 'First Day', description: 'Complete your first vape-free day', icon: '🌟' },
    { id: 'week_streak', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🏆' },
    { id: 'month_master', name: 'Month Master', description: 'Stay vape-free for 30 days', icon: '👑' },
    { id: 'community_hero', name: 'Community Hero', description: 'Help 5 other users', icon: '💪' },
    { id: 'mindfulness_guru', name: 'Mindfulness Guru', description: 'Complete 10 breathing exercises', icon: '🧘' }
];

// Emergency Support Messages
const supportMessages = [
    "Remember why you started this journey. You're stronger than you think!",
    "Take deep breaths. This craving will pass in 3-5 minutes.",
    "Drink water or chew gum to keep your mouth busy.",
    "You're not alone. Many others are going through the same thing.",
    "Think about all the money you're saving!",
    "Your health is improving every minute you stay vape-free.",
    "You've got this! One day at a time."
];

// Game state
let currentGame = null;
let gameScore = 0;

// Game words for word scramble
const gameWords = [
    { word: 'HEALTHY', hint: 'Good for your body' },
    { word: 'MINDFUL', hint: 'Being present in the moment' },
    { word: 'STRONG', hint: 'Having power and resilience' },
    { word: 'FREEDOM', hint: 'Being free from addiction' },
    { word: 'ENERGY', hint: 'Vitality and power' }
];

// Memory game cards
const memoryCards = [
    '🌟', '🌟', '💪', '💪', '🧘', '🧘', '🌱', '🌱',
    '🎯', '🎯', '💧', '💧', '🌈', '🌈', '🌞', '🌞'
];

// Initialize the app
function initApp() {
    loadUserData();
    updateUI();
    setDailyChallenge();
    checkStreak();
    initNoteViewer();
    initStreakButtons();
}

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('breathEasyData');
    if (savedData) {
        userData = JSON.parse(savedData);
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('breathEasyData', JSON.stringify(userData));
}

// Update all UI elements
function updateUI() {
    document.getElementById('streakCounter').textContent = userData.streak;
    document.getElementById('pointsCounter').textContent = userData.points;
    updateBadges();
    updateMoodHistory();
    updateContacts();
}

// Set a random daily challenge
function setDailyChallenge() {
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    const dailyChallengeDiv = document.getElementById('dailyChallenge');
    const breathingExerciseDiv = document.getElementById('breathingExercise');
    
    if (!dailyChallengeDiv || !breathingExerciseDiv) {
        console.error('Required elements not found');
        return;
    }
    
    // Update challenge text
    dailyChallengeDiv.innerHTML = `
        <p>${challenge.text}</p>
        ${challenge.type === 'breathing' ? 
            `<div class="breathing-pattern-info">${breathingPatterns[challenge.pattern].description}</div>` : 
            ''}
    `;
    
    // Show/hide breathing exercise interface
    breathingExerciseDiv.style.display = challenge.type === 'breathing' ? 'block' : 'none';
    
    // Reset breathing exercise state
    if (challenge.type === 'breathing') {
        const circle = document.querySelector('.breathing-circle');
        const text = document.querySelector('.breathing-text');
        if (circle && text) {
            circle.classList.remove('inhale', 'exhale', 'hold');
            text.textContent = 'Ready to start?';
        }
    }
}

// Start breathing exercise
function startBreathingExercise() {
    if (breathingExercise.isActive) return;
    
    const currentChallenge = challenges.find(c => c.type === 'breathing');
    if (!currentChallenge) return;
    
    const pattern = breathingPatterns[currentChallenge.pattern];
    breathingExercise.isActive = true;
    breathingExercise.breaths = 0;
    const circle = document.querySelector('.breathing-circle');
    const text = document.querySelector('.breathing-text');
    
    function breathe() {
        if (breathingExercise.breaths >= pattern.breaths) {
            breathingExercise.isActive = false;
            circle.classList.remove('inhale', 'exhale', 'hold');
            text.textContent = 'Exercise complete!';
            return;
        }
        
        // Inhale
        circle.classList.add('inhale');
        text.textContent = 'Breathe in...';
        
        setTimeout(() => {
            if (pattern.hold) {
                // Hold
                circle.classList.remove('inhale');
                circle.classList.add('hold');
                text.textContent = 'Hold...';
                
                setTimeout(() => {
                    // Exhale
                    circle.classList.remove('hold');
                    circle.classList.add('exhale');
                    text.textContent = 'Breathe out...';
                    
                    setTimeout(() => {
                        circle.classList.remove('exhale');
                        breathingExercise.breaths++;
                        breathe();
                    }, pattern.exhale * 1000);
                }, pattern.hold * 1000);
            } else {
                // Exhale
                circle.classList.remove('inhale');
                circle.classList.add('exhale');
                text.textContent = 'Breathe out...';
                
                setTimeout(() => {
                    circle.classList.remove('exhale');
                    breathingExercise.breaths++;
                    breathe();
                }, pattern.exhale * 1000);
            }
        }, pattern.inhale * 1000);
    }
    
    breathe();
}

// Complete the daily challenge
function completeChallenge() {
    userData.points += 100;
    saveUserData();
    updateUI();
    alert('Great job! You earned 100 points!');
    setDailyChallenge();
}

// Enhanced mood logging with notes and time
function logMood(mood) {
    const note = prompt('Add a note about your mood (optional):');
    const now = new Date();
    const moodEntry = {
        mood: mood,
        timestamp: now.toISOString(),
        note: note || '',
        timeOfDay: now.getHours() < 12 ? 'morning' : 
                   now.getHours() < 17 ? 'afternoon' : 'evening'
    };
    
    // Add to mood history
    userData.moodHistory.push(moodEntry);
    
    // Store note if provided
    if (note) {
        userData.moodNotes[moodEntry.timestamp] = note;
    }
    
    // Save and update immediately
    saveUserData();
    updateMoodHistory();
    
    // Add points for mood tracking
    userData.points += 10;
    saveUserData();
    updateUI();
}

// Enhanced mood visualization with trend lines and notes
function updateMoodHistory() {
    const canvas = document.getElementById('moodCanvas');
    if (!canvas) return; // Guard clause if canvas doesn't exist
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get last 7 days of mood data
    const lastWeek = userData.moodHistory
        .filter(entry => {
            const entryDate = new Date(entry.timestamp);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return entryDate >= weekAgo;
        })
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    if (lastWeek.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No mood data for the past week', width/2, height/2);
        return;
    }
    
    // Draw mood visualization
    const barWidth = width / lastWeek.length;
    const maxHeight = height - 60; // More space for labels and notes
    
    // Draw trend line
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    
    lastWeek.forEach((entry, index) => {
        const x = index * barWidth + barWidth/2;
        const moodValue = entry.mood === 'great' ? 1 :
                         entry.mood === 'good' ? 0.8 :
                         entry.mood === 'okay' ? 0.6 :
                         entry.mood === 'bad' ? 0.4 : 0.2;
        const y = height - (moodValue * maxHeight);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Clear previous note positions
    canvas.notePositions = [];
    
    // Draw bars and notes
    lastWeek.forEach((entry, index) => {
        const x = index * barWidth;
        const barHeight = (entry.mood === 'great' ? 1 :
                          entry.mood === 'good' ? 0.8 :
                          entry.mood === 'okay' ? 0.6 :
                          entry.mood === 'bad' ? 0.4 : 0.2) * maxHeight;
        
        // Draw bar
        ctx.fillStyle = moodColors[entry.mood];
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
        
        // Add date label
        const date = new Date(entry.timestamp);
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                    x + barWidth/2, height - 5);
        
        // Add time of day indicator
        ctx.font = '8px Arial';
        ctx.fillText(entry.timeOfDay.charAt(0).toUpperCase(), 
                    x + barWidth/2, height - 15);
        
        // Add note if exists
        if (entry.note) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('📝', x + barWidth/2, height - 25);
            
            // Store note position for click detection
            canvas.notePositions.push({
                x: x + barWidth/2,
                y: height - 25,
                note: entry.note,
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                mood: entry.mood,
                timeOfDay: entry.timeOfDay
            });
        }
    });
}

// Add click handler for note viewing
function initNoteViewer() {
    const canvas = document.getElementById('moodCanvas');
    
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        if (canvas.notePositions) {
            canvas.notePositions.forEach(position => {
                // Check if click is within the bar area (within 30px radius of the bar center)
                const distance = Math.sqrt(
                    Math.pow(x - position.x, 2) + 
                    Math.pow(y - position.y, 2)
                );
                
                // Increased click area to 30px radius (from 15px)
                if (distance < 30) {
                    showNoteModal(position.note, position.date, position.mood, position.timeOfDay);
                }
            });
        }
    });
}

// Show note in a modal with time of day
function showNoteModal(note, date, mood, timeOfDay) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('noteModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'noteModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Mood Note for ${date}</h3>
                <div class="mood-indicator" style="background-color: ${moodColors[mood]}">
                    Mood: ${mood.charAt(0).toUpperCase() + mood.slice(1)}
                </div>
                <div class="time-indicator">
                    Time of Day: ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
                </div>
                <p id="noteContent"></p>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add close button functionality
        modal.querySelector('.close').onclick = function() {
            modal.style.display = 'none';
        };
        
        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }
    
    // Update and show modal
    document.getElementById('noteContent').textContent = note;
    modal.style.display = 'block';
}

// Show emergency help
function showEmergencyHelp() {
    const message = supportMessages[Math.floor(Math.random() * supportMessages.length)];
    alert(message);
    
    // Add points for reaching out for help
    userData.points += 50;
    saveUserData();
    updateUI();
}

// Send a message to the community
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        input.value = '';
        
        // Add points for community engagement
        userData.points += 25;
        saveUserData();
        updateUI();
    }
}

// Add an emergency contact
function addContact() {
    const name = prompt('Enter contact name:');
    const phone = prompt('Enter contact phone number:');
    
    if (name && phone) {
        userData.contacts.push({ name, phone });
        saveUserData();
        updateContacts();
    }
}

// Update contacts display
function updateContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';
    
    userData.contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact';
        contactElement.innerHTML = `
            <strong>${contact.name}</strong><br>
            ${contact.phone}
        `;
        contactsList.appendChild(contactElement);
    });
}

// Update badges display
function updateBadges() {
    const badgeContainer = document.getElementById('badgeContainer');
    badgeContainer.innerHTML = '';
    
    userData.badges.forEach(badgeId => {
        const badge = badges.find(b => b.id === badgeId);
        if (badge) {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge';
            badgeElement.innerHTML = `
                <span class="badge-icon">${badge.icon}</span>
                <span class="badge-name">${badge.name}</span>
            `;
            badgeContainer.appendChild(badgeElement);
        }
    });
}

// Check and update streak
function checkStreak() {
    const today = new Date().toDateString();
    if (userData.lastCheckIn !== today) {
        userData.streak++;
        userData.points += 50; // Daily streak bonus
        userData.lastCheckIn = today;
        saveUserData();
        updateUI();
        
        // Check for badge achievements
        checkBadgeAchievements();
    }
}

// Check for badge achievements
function checkBadgeAchievements() {
    if (userData.streak === 1 && !userData.badges.includes('first_day')) {
        userData.badges.push('first_day');
    }
    if (userData.streak === 7 && !userData.badges.includes('week_streak')) {
        userData.badges.push('week_streak');
    }
    if (userData.streak === 30 && !userData.badges.includes('month_master')) {
        userData.badges.push('month_master');
    }
    saveUserData();
    updateUI();
}

// Manual streak management
function updateStreakManually(success) {
    const today = new Date().toDateString();
    
    if (userData.lastCheckIn === today) {
        alert('You\'ve already updated your streak today. Come back tomorrow!');
        return;
    }
    
    if (success) {
        userData.streak++;
        userData.points += 50; // Daily streak bonus
        userData.lastCheckIn = today;
        
        // Different encouraging messages based on streak length
        let message = '';
        if (userData.streak === 1) {
            message = 'Great start! Day 1 is the beginning of your journey! 🌟';
        } else if (userData.streak === 7) {
            message = 'Amazing! You\'ve completed your first week! 🎉';
        } else if (userData.streak === 30) {
            message = 'Incredible! You\'ve reached a full month! 🎊';
        } else if (userData.streak % 7 === 0) {
            message = `Congratulations! You've reached ${userData.streak} days! Keep going! 🎯`;
        } else {
            message = `Keep up the great work! You're on day ${userData.streak}! 💪`;
        }
        
        alert(message);
    } else {
        userData.streak = 0;
        userData.lastCheckIn = today;
        alert("It's okay to start over. Every day is a new opportunity to begin again. You've got this! 🌱");
    }
    
    saveUserData();
    updateUI();
    checkBadgeAchievements();
}

// Initialize streak management buttons
function initStreakButtons() {
    const streakSection = document.querySelector('.progress-section');
    if (!streakSection) {
        console.error('Progress section not found');
        return;
    }
    
    // Check if buttons already exist
    if (streakSection.querySelector('.streak-controls')) {
        return;
    }
    
    const streakControls = document.createElement('div');
    streakControls.className = 'streak-controls';
    streakControls.innerHTML = `
        <button onclick="updateStreakManually(true)" class="success-button">Add Day to Streak</button>
        <button onclick="updateStreakManually(false)" class="reset-button">Reset Streak</button>
    `;
    
    // Insert after the stats div
    const statsDiv = streakSection.querySelector('.stats');
    if (statsDiv) {
        statsDiv.insertAdjacentElement('afterend', streakControls);
    } else {
        streakSection.appendChild(streakControls);
    }
}

// Start memory game
function startMemoryGame() {
    currentGame = 'memory';
    gameScore = 0;
    updateGameScore();
    showGameArea();
    
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h3>Memory Match</h3>
        <p>Match pairs of cards to earn points!</p>
        <div class="memory-grid"></div>
    `;
    
    const grid = gameContent.querySelector('.memory-grid');
    const shuffledCards = [...memoryCards].sort(() => Math.random() - 0.5);
    
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.card = card;
        cardElement.dataset.index = index;
        cardElement.onclick = () => flipCard(cardElement);
        grid.appendChild(cardElement);
    });
}

// Breath game functions
let activeBubbles = 0;
const MAX_ACTIVE_BUBBLES = 3;

function createBubble(container) {
    // Check if we've reached the maximum number of active bubbles
    if (activeBubbles >= MAX_ACTIVE_BUBBLES) {
        // Wait a bit before trying to create another bubble
        setTimeout(() => createBubble(container), 1000);
        return;
    }
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = Math.random() * 50 + 30;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    const startX = Math.random() * (container.offsetWidth - size);
    const startY = container.offsetHeight + size;
    
    bubble.style.left = `${startX}px`;
    bubble.style.top = `${startY}px`;
    
    bubble.onclick = () => {
        gameScore += 5;
        updateGameScore();
        bubble.remove();
        activeBubbles--;
        // Add a delay before creating a new bubble
        setTimeout(() => createBubble(container), 500);
    };
    
    container.appendChild(bubble);
    activeBubbles++;
    
    const duration = Math.random() * 3000 + 2000;
    bubble.style.transition = `top ${duration}ms linear`;
    
    setTimeout(() => {
        bubble.style.top = `-${size}px`;
        setTimeout(() => {
            bubble.remove();
            activeBubbles--;
            // Add a delay before creating a new bubble
            setTimeout(() => createBubble(container), 500);
        }, duration);
    }, 100);
}

// Start breath game
function startBreathGame() {
    currentGame = 'breath';
    gameScore = 0;
    activeBubbles = 0; // Reset active bubbles counter
    updateGameScore();
    showGameArea();
    
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <div class="breath-game">
            <h3>Breath Bubble</h3>
            <p>Pop bubbles while practicing your breathing!</p>
            <div id="bubbleContainer" style="height: 400px; position: relative;"></div>
        </div>
    `;
    
    const container = document.getElementById('bubbleContainer');
    // Start with just one bubble
    createBubble(container);
}

// Start word game
function startWordGame() {
    currentGame = 'word';
    gameScore = 0;
    selectedLetters = []; // Reset selected letters
    updateGameScore();
    showGameArea();
    
    const randomWord = gameWords[Math.random() * gameWords.length];
    const scrambledWord = randomWord.word.split('').sort(() => Math.random() - 0.5).join('');
    
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <div class="word-game">
            <h3>Word Scramble</h3>
            <p>Hint: ${randomWord.hint}</p>
            <div class="word-display">${scrambledWord}</div>
            <div class="letter-buttons"></div>
        </div>
    `;
    
    const letterButtons = gameContent.querySelector('.letter-buttons');
    // Create array of letters and shuffle them
    const letters = randomWord.word.split('');
    const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);
    
    // Add shuffled letters to buttons
    shuffledLetters.forEach(letter => {
        const button = document.createElement('button');
        button.className = 'letter-button';
        button.textContent = letter;
        button.onclick = () => selectLetter(button, letter, randomWord.word);
        letterButtons.appendChild(button);
    });
}

// Memory game functions
let flippedCards = [];
let matchedPairs = 0;

function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    card.textContent = card.dataset.card;
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.card === card2.dataset.card) {
        matchedPairs++;
        gameScore += 10;
        updateGameScore();
        
        if (matchedPairs === memoryCards.length / 2) {
            setTimeout(() => {
                alert('Congratulations! You won!');
                closeGame();
            }, 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }
    
    flippedCards = [];
}

// Word game functions
let selectedLetters = [];

function selectLetter(button, letter, word) {
    // If letter is already selected, deselect it
    if (button.classList.contains('used')) {
        button.classList.remove('used');
        selectedLetters = selectedLetters.filter(l => l !== letter);
        const wordDisplay = document.querySelector('.word-display');
        wordDisplay.textContent = selectedLetters.join('');
        return;
    }
    
    // Add new letter
    selectedLetters.push(letter);
    button.classList.add('used');
    
    const wordDisplay = document.querySelector('.word-display');
    wordDisplay.textContent = selectedLetters.join('');
    
    if (selectedLetters.length === word.length) {
        if (selectedLetters.join('') === word) {
            gameScore += 20;
            updateGameScore();
            setTimeout(() => {
                alert('Congratulations! You solved the word!');
                closeGame();
            }, 500);
        } else {
            setTimeout(() => {
                alert('Try again!');
                closeGame();
            }, 500);
        }
    }
}

// Game utility functions
function showGameArea() {
    document.getElementById('gameArea').style.display = 'block';
}

function closeGame() {
    document.getElementById('gameArea').style.display = 'none';
    currentGame = null;
    gameScore = 0;
    selectedLetters = []; // Reset selected letters when closing game
    updateGameScore();
}

function updateGameScore() {
    document.getElementById('gameScore').textContent = `Score: ${gameScore}`;
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initApp); 