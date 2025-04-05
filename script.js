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
        text: "Rester sans vapoter pendant 24 heures",
        type: "general"
    },
    {
        text: "Essayer un nouveau passe-temps pendant 10 minutes",
        type: "general"
    },
    {
        text: "Pratiquer un exercice de respiration basique",
        type: "breathing",
        pattern: "basic"
    },
    {
        text: "Essayer la technique de respiration apaisante",
        type: "breathing",
        pattern: "calming"
    },
    {
        text: "Faire un exercice de respiration énergisant",
        type: "breathing",
        pattern: "energizing"
    },
    {
        text: "Boire de l'eau au lieu de vapoter",
        type: "general"
    },
    {
        text: "Partager votre progression avec un ami",
        type: "general"
    },
    {
        text: "Faire un exercice rapide quand vous avez envie de vapoter",
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
        name: "Respiration Basique",
        inhale: 4,
        exhale: 4,
        breaths: 5,
        description: "Pattern simple de respiration 4-4"
    },
    calming: {
        name: "Respiration Apaisante",
        inhale: 4,
        hold: 4,
        exhale: 8,
        breaths: 4,
        description: "Pattern 4-4-8 pour une relaxation profonde"
    },
    energizing: {
        name: "Respiration Énergisante",
        inhale: 2,
        exhale: 2,
        breaths: 8,
        description: "Pattern rapide 2-2 pour l'énergie"
    }
};

// Badges
const badges = [
    { id: 'first_day', name: 'Premier Jour', description: 'Complétez votre premier jour sans vapoter', icon: '🌟' },
    { id: 'week_streak', name: 'Guerrier de la Semaine', description: 'Maintenez une série de 7 jours', icon: '🏆' },
    { id: 'month_master', name: 'Maître du Mois', description: 'Restez sans vapoter pendant 30 jours', icon: '👑' },
    { id: 'community_hero', name: 'Héros de la Communauté', description: 'Aidez 5 autres utilisateurs', icon: '💪' },
    { id: 'mindfulness_guru', name: 'Gourou de la Pleine Conscience', description: 'Complétez 10 exercices de respiration', icon: '🧘' }
];

// Emergency Support Messages
const supportMessages = [
    "Souvenez-vous pourquoi vous avez commencé ce voyage. Vous êtes plus fort que vous ne le pensez !",
    "Respirez profondément. Cette envie passera dans 3-5 minutes.",
    "Buvez de l'eau ou mâchez du chewing-gum pour occuper votre bouche.",
    "Vous n'êtes pas seul. Beaucoup d'autres traversent la même chose.",
    "Pensez à tout l'argent que vous économisez !",
    "Votre santé s'améliore chaque minute où vous restez sans vapoter.",
    "Vous en êtes capable ! Un jour à la fois."
];

// Game state
let currentGame = null;
let gameScore = 0;
let isPlaying = false; // Global play/pause state

// Game words for word scramble
const gameWords = [
    { word: 'CALME', hint: 'Un état de tranquillité' },
    { word: 'JOIE', hint: 'Un sentiment de bonheur' },
    { word: 'PAIX', hint: 'Un état de sérénité' },
    { word: 'AMOUR', hint: 'Un sentiment profond' },
    { word: 'RÊVE', hint: 'Une pensée pendant le sommeil' }
];

// Memory game cards
const memoryCards = [
    '🌟', '🌟', '🌙', '🌙', '☀️', '☀️', '⭐', '⭐',
    '🌈', '🌈', '🌺', '🌺', '🌼', '🌼', '🌻', '🌻'
];

// Color Match Game
let colorSequence = [];
let userSequence = [];

function startColorGame() {
    currentGame = 'color';
    gameScore = 0;
    colorSequence = [];
    userSequence = [];
    isPlaying = false;
    updateGameScore();
    showGameArea();
    
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <div class="color-game">
            <h3>Match de Couleurs</h3>
            <p>Mémorisez et répétez la séquence de couleurs !</p>
            <div class="color-sequence"></div>
            <div class="color-buttons">
                <button class="color-button" style="background-color: #FF6B6B;" data-color="#FF6B6B"></button>
                <button class="color-button" style="background-color: #4ECDC4;" data-color="#4ECDC4"></button>
                <button class="color-button" style="background-color: #45B7D1;" data-color="#45B7D1"></button>
                <button class="color-button" style="background-color: #96CEB4;" data-color="#96CEB4"></button>
                <button class="color-button" style="background-color: #FFEEAD;" data-color="#FFEEAD"></button>
                <button class="color-button" style="background-color: #D4A5A5;" data-color="#D4A5A5"></button>
                <button class="color-button" style="background-color: #9B59B6;" data-color="#9B59B6"></button>
                <button class="color-button" style="background-color: #E67E22;" data-color="#E67E22"></button>
            </div>
            <button class="start-button">Commencer</button>
        </div>
    `;
    
    const startButton = gameContent.querySelector('.start-button');
    startButton.onclick = () => {
        if (!isPlaying) {
            colorSequence = []; // Reset sequence when starting new game
            userSequence = [];
            isPlaying = true;
            startButton.disabled = true;
            addToSequence();
        }
    };
    
    const colorButtons = gameContent.querySelectorAll('.color-button');
    colorButtons.forEach(button => {
        button.onclick = () => {
            if (!isPlaying) return;
            const color = button.dataset.color;
            userSequence.push(color);
            button.style.opacity = '0.5';
            setTimeout(() => {
                button.style.opacity = '1';
            }, 200);
            
            checkSequence();
        };
    });
}

function addToSequence() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#E67E22'];
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    colorSequence.push(newColor);
    
    const sequenceDisplay = document.querySelector('.color-sequence');
    sequenceDisplay.innerHTML = '';
    
    // Show the sequence
    colorSequence.forEach((color, index) => {
        const colorBlock = document.createElement('div');
        colorBlock.className = 'color-block';
        colorBlock.style.backgroundColor = color;
        sequenceDisplay.appendChild(colorBlock);
        
        setTimeout(() => {
            colorBlock.style.opacity = '0.5';
            setTimeout(() => {
                colorBlock.style.opacity = '1';
            }, 500);
        }, index * 1000);
    });
    
    // Hide the sequence after showing it
    setTimeout(() => {
        sequenceDisplay.innerHTML = '';
        isPlaying = true;
    }, colorSequence.length * 1000 + 500);
}

function checkSequence() {
    const lastIndex = userSequence.length - 1;
    const expectedColor = colorSequence[lastIndex];
    const actualColor = userSequence[lastIndex];
    
    if (actualColor !== expectedColor) {
        isPlaying = false;
        document.querySelector('.start-button').disabled = false;
        alert('Séquence incorrecte ! Essayez encore !');
        // Reset sequences when incorrect
        colorSequence = [];
        userSequence = [];
        return;
    }
    
    if (userSequence.length === colorSequence.length) {
        gameScore += 10;
        updateGameScore();
        userSequence = [];
        setTimeout(addToSequence, 1000);
    }
}

// Memory Game improvements
function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
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
        
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        
        if (matchedPairs === memoryCards.length / 2) {
            setTimeout(() => {
                alert('Félicitations ! Vous avez gagné !');
                closeGame();
            }, 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
        setTimeout(() => {
            flippedCards = [];
        }, 500);
    }
}

// Pattern Memory Game
const patterns = [
    '⬆️', '⬇️', '⬅️', '➡️',
    '↖️', '↗️', '↙️', '↘️',
    '⏹️', '⏺️', '⏺️', '⏹️'
];

function startPatternGame() {
    currentGame = 'pattern';
    gameScore = 0;
    updateGameScore();
    showGameArea();
    
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <div class="pattern-game">
            <h3>Mémoire des Motifs</h3>
            <p>Mémorisez et reproduisez le motif qui apparaît !</p>
            <div class="pattern-display"></div>
            <div class="pattern-buttons"></div>
            <button onclick="startPatternSequence()" class="primary-button">Démarrer le Motif</button>
        </div>
    `;
    
    const patternButtons = gameContent.querySelector('.pattern-buttons');
    patterns.forEach(pattern => {
        const button = document.createElement('button');
        button.className = 'pattern-button';
        button.textContent = pattern;
        button.dataset.pattern = pattern;
        button.onclick = () => checkPatternMatch(button);
        patternButtons.appendChild(button);
    });
}

let patternSequence = [];
let playerPatternSequence = [];
let isPatternPlaying = false;

function startPatternSequence() {
    if (isPatternPlaying) return;
    
    isPatternPlaying = true;
    playerPatternSequence = [];
    patternSequence.push(patterns[Math.floor(Math.random() * patterns.length)]);
    
    const patternDisplay = document.querySelector('.pattern-display');
    patternDisplay.innerHTML = '';
    
    patternSequence.forEach((pattern, index) => {
        const patternBlock = document.createElement('div');
        patternBlock.className = 'pattern-block';
        patternBlock.textContent = pattern;
        patternDisplay.appendChild(patternBlock);
        
        setTimeout(() => {
            patternBlock.style.opacity = '0.5';
            setTimeout(() => {
                patternBlock.style.opacity = '1';
            }, 500);
        }, index * 1000);
    });
    
    setTimeout(() => {
        isPatternPlaying = false;
        patternDisplay.innerHTML = '';
    }, patternSequence.length * 1000 + 500);
}

function checkPatternMatch(button) {
    if (isPatternPlaying) return;
    
    const pattern = button.dataset.pattern;
    playerPatternSequence.push(pattern);
    
    const index = playerPatternSequence.length - 1;
    if (pattern !== patternSequence[index]) {
        setTimeout(() => {
            alert('Motif incorrect ! Essayez encore !');
            closeGame();
        }, 500);
        return;
    }
    
    if (playerPatternSequence.length === patternSequence.length) {
        gameScore += patternSequence.length * 10;
        updateGameScore();
        // Only show success message when game is complete (e.g., after 5 successful rounds)
        if (patternSequence.length >= 5) {
            setTimeout(() => {
                alert('Félicitations ! Vous avez complété le jeu !');
                closeGame();
            }, 500);
        } else {
            // Continue to next round without message
            setTimeout(() => {
                startPatternSequence();
            }, 500);
        }
    }
}

// Initialize the app
function initApp() {
    loadUserData();
    updateUI();
    setDailyChallenge();
    initNoteViewer();
    initChat();
    updateContacts();
}

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('breatheEasyData');
    if (savedData) {
        userData = JSON.parse(savedData);
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('breatheEasyData', JSON.stringify(userData));
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
            text.textContent = 'Prêt à commencer ?';
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
            text.textContent = 'Exercice terminé !';
            return;
        }
        
        // Inhale
        circle.classList.add('inhale');
        text.textContent = 'Inspirez...';
        
        setTimeout(() => {
            if (pattern.hold) {
                // Hold
                circle.classList.remove('inhale');
                circle.classList.add('hold');
                text.textContent = 'Retenez...';
                
                setTimeout(() => {
                    // Exhale
                    circle.classList.remove('hold');
                    circle.classList.add('exhale');
                    text.textContent = 'Expirez...';
                    
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
                text.textContent = 'Expirez...';
                
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
    updateLevel(userData.points);
    alert('Bravo ! Vous avez gagné 100 points !');
    setDailyChallenge();
}

// Enhanced mood logging with notes and time
function logMood(mood) {
    const note = prompt('Ajoutez une note sur votre humeur (optionnel) :');
    const now = new Date();
    const moodEntry = {
        mood: mood,
        timestamp: now.toISOString(),
        note: note || '',
        timeOfDay: now.getHours() < 12 ? 'matin' : 
                   now.getHours() < 17 ? 'après-midi' : 'soir'
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
    updateLevel(userData.points);
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
        ctx.fillText('Aucune donnée d\'humeur pour la semaine passée', width/2, height/2);
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
                <h3>Note d'Humeur pour ${date}</h3>
                <div class="mood-indicator" style="background-color: ${moodColors[mood]}">
                    Humeur: ${mood === 'great' ? 'Excellent' :
                             mood === 'good' ? 'Bien' :
                             mood === 'okay' ? 'Correct' :
                             mood === 'bad' ? 'Mauvais' : 'Terrible'}
                </div>
                <div class="time-indicator">
                    Moment de la Journée: ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
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
    updateLevel(userData.points);
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
        updateLevel(userData.points);
    }
}

// Add an emergency contact
function addContact() {
    const name = prompt('Entrez le nom du contact :');
    const phone = prompt('Entrez le numéro de téléphone :');
    
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
        alert('Vous avez déjà mis à jour votre série aujourd\'hui. Revenez demain !');
        return;
    }
    
    if (success) {
        userData.streak++;
        userData.points += 50; // Daily streak bonus
        userData.lastCheckIn = today;
        
        // Different encouraging messages based on streak length
        let message = '';
        if (userData.streak === 1) {
            message = 'Excellent début ! Le jour 1 est le début de votre voyage ! 🌟';
        } else if (userData.streak === 7) {
            message = 'Incroyable ! Vous avez complété votre première semaine ! 🎉';
        } else if (userData.streak === 30) {
            message = 'Fantastique ! Vous avez atteint un mois complet ! 🎊';
        } else if (userData.streak % 7 === 0) {
            message = `Félicitations ! Vous avez atteint ${userData.streak} jours ! Continuez ! 🎯`;
        } else {
            message = `Continuez le bon travail ! Vous êtes au jour ${userData.streak} ! 💪`;
        }
        
        alert(message);
    } else {
        userData.streak = 0;
        userData.lastCheckIn = today;
        alert("C'est normal de recommencer. Chaque jour est une nouvelle opportunité de recommencer. Vous en êtes capable ! 🌱");
    }
    
    saveUserData();
    updateUI();
    checkBadgeAchievements();
}

// Start memory game
function startMemoryGame() {
    currentGame = 'memory';
    gameScore = 0;
    matchedPairs = 0;
    flippedCards = [];
    updateGameScore();
    showGameArea();
    
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h3>Jeu de Mémoire</h3>
        <p>Associez les paires de cartes pour gagner des points !</p>
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

function startBreathGame() {
    currentGame = 'breath';
    gameScore = 0;
    activeBubbles = 0;
    updateGameScore();
    showGameArea();
    
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <div class="breath-game">
            <h3>Bulles de Respiration</h3>
            <p>Éclatez des bulles tout en pratiquant votre respiration !</p>
            <div id="bubbleContainer" style="height: 400px; position: relative; overflow: hidden;"></div>
        </div>
    `;
    
    const container = document.getElementById('bubbleContainer');
    createBubble(container);
}

function createBubble(container) {
    if (activeBubbles >= MAX_ACTIVE_BUBBLES) {
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
            setTimeout(() => createBubble(container), 500);
        }, duration);
    }, 100);
}

// Word game functions
let selectedLetters = [];
let currentWord = null;

function startWordGame() {
    currentGame = 'word';
    gameScore = 0;
    selectedLetters = [];
    updateGameScore();
    showGameArea();
    
    currentWord = gameWords[Math.floor(Math.random() * gameWords.length)];
    const scrambledWord = currentWord.word.split('').sort(() => Math.random() - 0.5).join('');
    
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <div class="word-game">
            <h3>Mots Mêlés</h3>
            <p>Indice : ${currentWord.hint}</p>
            <div class="word-display">${scrambledWord}</div>
            <div class="letter-buttons"></div>
        </div>
    `;
    
    const letterButtons = gameContent.querySelector('.letter-buttons');
    const letters = currentWord.word.split('');
    const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);
    
    shuffledLetters.forEach(letter => {
        const button = document.createElement('button');
        button.className = 'letter-button';
        button.textContent = letter;
        button.onclick = () => selectLetter(button, letter);
        letterButtons.appendChild(button);
    });
}

function selectLetter(button, letter) {
    if (button.classList.contains('used')) {
        button.classList.remove('used');
        selectedLetters = selectedLetters.filter(l => l !== letter);
        const wordDisplay = document.querySelector('.word-display');
        wordDisplay.textContent = selectedLetters.join('');
        return;
    }
    
    selectedLetters.push(letter);
    button.classList.add('used');
    
    const wordDisplay = document.querySelector('.word-display');
    wordDisplay.textContent = selectedLetters.join('');
    
    if (selectedLetters.length === currentWord.word.length) {
        if (selectedLetters.join('') === currentWord.word) {
            gameScore += 20;
            updateGameScore();
            setTimeout(() => {
                startWordGame();
            }, 1000);
        } else {
            setTimeout(() => {
                alert('Essayez encore !');
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
    
    // Reset only the current game's state
    switch(currentGame) {
        case 'memory':
            flippedCards = [];
            matchedPairs = 0;
            break;
        case 'breath':
            activeBubbles = 0;
            break;
        case 'word':
            selectedLetters = [];
            break;
        case 'color':
            colorSequence = [];
            userSequence = [];
            isPlaying = false;
            break;
        case 'pattern':
            patternSequence = [];
            playerPatternSequence = [];
            isPatternPlaying = false;
            break;
    }
    
    currentGame = null;
    gameScore = 0;
    updateGameScore();
}

function updateGameScore() {
    document.getElementById('gameScore').textContent = `Score : ${gameScore}`;
}

// Theme Management
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Initialize theme based on system preference
setTheme(prefersDarkScheme.matches);

themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Loading Animation
function showLoading() {
    document.querySelector('.loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.querySelector('.loading-overlay').style.display = 'none';
}

// Visual Feedback
function showFeedback(message, type = 'success') {
    const feedback = document.querySelector('.feedback-message');
    feedback.textContent = message;
    feedback.className = `feedback-message ${type}`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
}

// Progress Bar
function updateProgress(percent) {
    document.querySelector('.progress-bar').style.width = `${percent}%`;
}

// Achievement System
const achievements = {
    firstGame: { title: 'Premier Jeu', description: 'Complétez votre premier jeu', icon: 'gamepad' },
    streakMaster: { title: 'Maître des Séries', description: 'Atteignez une série de 5 jours', icon: 'fire' },
    perfectGame: { title: 'Jeu Parfait', description: 'Complétez un jeu sans erreur', icon: 'trophy' },
    dailyPlayer: { title: 'Joueur Quotidien', description: 'Jouez pendant 7 jours consécutifs', icon: 'calendar-check' }
};

function showAchievement(achievementId) {
    const achievement = achievements[achievementId];
    const badge = document.querySelector('.achievement-badge');
    badge.innerHTML = `
        <i class="fas fa-${achievement.icon}"></i>
        <span class="achievement-text">${achievement.title}</span>
    `;
    badge.style.display = 'flex';
    
    setTimeout(() => {
        badge.style.display = 'none';
    }, 5000);
}

// Tutorial System
const tutorialOverlay = document.getElementById('tutorialOverlay');
const tutorialSteps = document.querySelectorAll('.tutorial-step');
const tutorialPrev = document.querySelector('.tutorial-prev');
const tutorialNext = document.querySelector('.tutorial-next');
const tutorialSkip = document.querySelector('.tutorial-skip');
const tutorialClose = document.querySelector('.tutorial-close');
let currentStep = 0;

// Check if this is the first visit
if (!localStorage.getItem('tutorialCompleted')) {
    showTutorial();
}

function showTutorial() {
    tutorialOverlay.style.display = 'flex';
    showStep(0);
    updateNavigationButtons();
}

function hideTutorial() {
    tutorialOverlay.style.display = 'none';
    localStorage.setItem('tutorialCompleted', 'true');
}

function showStep(stepIndex) {
    tutorialSteps.forEach(step => step.classList.remove('active'));
    tutorialSteps[stepIndex].classList.add('active');
    currentStep = stepIndex;
    updateNavigationButtons();
}

function nextStep() {
    if (currentStep < tutorialSteps.length - 1) {
        showStep(currentStep + 1);
    } else {
        hideTutorial();
    }
}

function prevStep() {
    if (currentStep > 0) {
        showStep(currentStep - 1);
    }
}

function updateNavigationButtons() {
    tutorialPrev.disabled = currentStep === 0;
    tutorialNext.textContent = currentStep === tutorialSteps.length - 1 ? 'Terminer' : 'Suivant';
}

// Tutorial Event Listeners
tutorialNext.addEventListener('click', nextStep);
tutorialPrev.addEventListener('click', prevStep);
tutorialSkip.addEventListener('click', hideTutorial);
tutorialClose.addEventListener('click', hideTutorial);

// Close tutorial when clicking outside
tutorialOverlay.addEventListener('click', (e) => {
    if (e.target === tutorialOverlay) {
        hideTutorial();
    }
});

// High Score System
let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highScore').textContent = highScore;

function updateHighScore(score) {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
}

// Level System
let currentLevel = 1;
document.getElementById('currentLevel').textContent = currentLevel;

function updateLevel(points) {
    // Level up every 500 points
    const newLevel = Math.floor(points / 500) + 1;
    if (newLevel > currentLevel) {
        currentLevel = newLevel;
        document.getElementById('currentLevel').textContent = currentLevel;
        showFeedback(`Niveau ${currentLevel} atteint !`, 'success');
    }
}

// Modify existing game functions to use new features
function startGame(gameType) {
    showLoading();
    setTimeout(() => {
        // Initialize game
        switch(gameType) {
            case 'memory':
                startMemoryGame();
                break;
            case 'breath':
                startBreathGame();
                break;
            case 'word':
                startWordGame();
                break;
            case 'color':
                startColorGame();
                break;
            case 'pattern':
                startPatternGame();
                break;
        }
        hideLoading();
    }, 1000);
}

// Update game completion handlers
function handleGameCompletion(score) {
    updateHighScore(score);
    updateLevel(score);
    updateProgress((score % 100));
    
    if (score > 0) {
        showFeedback('Félicitations !', 'success');
    }
}

// Add difficulty levels to games
const difficulties = {
    easy: { multiplier: 1, timeLimit: 2000 },
    medium: { multiplier: 1.5, timeLimit: 1500 },
    hard: { multiplier: 2, timeLimit: 1000 }
};

let currentDifficulty = 'easy';

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    showFeedback(`Difficulté changée: ${difficulty}`, 'success');
}

// Modify existing game functions to use difficulty settings
function startColorSequence() {
    const difficulty = difficulties[currentDifficulty];
    // ... existing code ...
    setTimeout(() => {
        // Show sequence
    }, difficulty.timeLimit);
}

// Add offline support
window.addEventListener('online', () => {
    showFeedback('Vous êtes en ligne !', 'success');
});

window.addEventListener('offline', () => {
    showFeedback('Vous êtes hors ligne. Les données seront synchronisées plus tard.', 'error');
});

// Music Player
let currentAudio = null;
const musicTracks = {
    classical: {
        title: "Classique Relaxant",
        url: "https://drive.google.com/file/d/1OUy0dYeOUGY05Tj2q6Kl_HXAhCc1_5xX/view?usp=sharing",
        description: "Musique classique apaisante pour la relaxation"
    },
    meditation: {
        title: "Méditation Zen",
        url: "https://drive.google.com/file/d/1Wf1_TyGEz_2jfY32F4-XFDliDkB7lihF/view?usp=sharing",
        description: "Musique de méditation profonde pour la relaxation et le sommeil"
    },
    nature: {
        title: "Sons de la Nature",
        url: "https://drive.google.com/file/d/1JUACRQVTj82vkUOojzKp3R2zZKJ1IJpw/view?usp=sharing",
        description: "Sons apaisants de rivière et d'oiseaux pour la relaxation"
    }
};

function togglePlayPause() {
    const playPauseButton = document.getElementById('playPauseButton');
    const icon = playPauseButton.querySelector('i');
    
    if (currentAudio) {
        if (isPlaying) {
            currentAudio.pause();
            isPlaying = false;
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            playPauseButton.classList.remove('playing');
        } else {
            currentAudio.play().catch(error => {
                console.error('Error playing audio:', error);
                document.getElementById('currentTrack').textContent = 'Erreur de lecture. Veuillez réessayer.';
            });
            isPlaying = true;
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            playPauseButton.classList.add('playing');
        }
    }
}

function toggleMusic(type) {
    const track = musicTracks[type];
    if (!track) {
        console.error('Invalid music track type:', type);
        return;
    }

    const musicButton = document.querySelector(`.music-button[onclick="toggleMusic('${type}')"]`);
    const playPauseButton = document.getElementById('playPauseButton');
    const icon = playPauseButton.querySelector('i');
    
    if (!musicButton) {
        console.error('Music button not found for type:', type);
        return;
    }
    
    // Stop current music if playing
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        isPlaying = false;
        document.querySelectorAll('.music-button').forEach(btn => btn.classList.remove('active'));
        document.getElementById('currentTrack').textContent = 'Aucune musique en cours';
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        playPauseButton.classList.remove('playing');
    }
    
    // Open the music in a new tab
    window.open(track.url, '_blank');
    
    // Update UI to show the track is selected
    // First remove active class from all buttons
    document.querySelectorAll('.music-button').forEach(btn => btn.classList.remove('active'));
    // Then add active class to the clicked button
    musicButton.classList.add('active');
    document.getElementById('currentTrack').textContent = `${track.title} - ${track.description}`;
}

// Volume control
const volumeSlider = document.getElementById('volumeSlider');
if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        if (currentAudio) {
            currentAudio.volume = e.target.value / 100;
        }
    });
}

// Clean up audio when page is closed
window.addEventListener('beforeunload', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
});

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initApp); 