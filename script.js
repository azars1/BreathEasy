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
    userData.moodHistory.push(moodEntry);
    if (note) {
        userData.moodNotes[moodEntry.timestamp] = note;
    }
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
                // Check if click is near the note icon (within 15px radius)
                const distance = Math.sqrt(
                    Math.pow(x - position.x, 2) + 
                    Math.pow(y - position.y, 2)
                );
                
                if (distance < 15) {
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
        alert('It\'s okay to start over. Every day is a new opportunity to begin again. You've got this! 🌱');
    }
    
    saveUserData();
    updateUI();
    checkBadgeAchievements();
}

// Initialize streak management buttons
function initStreakButtons() {
    const streakSection = document.querySelector('.progress-section');
    if (!streakSection) return;
    
    const streakControls = document.createElement('div');
    streakControls.className = 'streak-controls';
    streakControls.innerHTML = `
        <button onclick="updateStreakManually(true)" class="success-button">Add Day to Streak</button>
        <button onclick="updateStreakManually(false)" class="reset-button">Reset Streak</button>
    `;
    
    streakSection.appendChild(streakControls);
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initApp); 