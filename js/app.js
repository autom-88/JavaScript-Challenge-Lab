"use strict";
const STORAGE_KEY = "javascript-challenge-profile";
const defaultProfile = {
    nickname: "Developer",
    level: 1,
    xp: 0,
    completedChallenges: 0,
    totalPoints: 0,
    streak: 0,
    badges: [],
    activity: [
        "Benvenuto nella JavaScript Challenge!"
    ],
    theme: "dark"
};
let profile = { ...defaultProfile };
const playerName =
    document.getElementById("playerName");
const playerLevel =
    document.getElementById("playerLevel");
const xpFill =
    document.getElementById("xpFill");
const xpText =
    document.getElementById("xpText");
const completedChallenges =
    document.getElementById("completedChallenges");
const points =
    document.getElementById("points");
const streak =
    document.getElementById("streak");
const badges =
    document.getElementById("badges");
const activityList =
    document.getElementById("activityList");
const nicknameInput =
    document.getElementById("nickname");
const themeSelect =
    document.getElementById("themeSelect");
const saveProfileButton =
    document.getElementById("saveProfile");
const resetProgressButton =
    document.getElementById("resetProgress");
function loadProfile(){
    const saved =
        localStorage.getItem(STORAGE_KEY);
    if(saved){
        try{
            profile = {
                ...defaultProfile,
                ...JSON.parse(saved)
            };
        }
        catch(error){
            console.error(error);
            profile = { ...defaultProfile };
        }
    }
}
function saveProfile(){
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(profile)
    );
}
function getRequiredXP(level){
    return level * 100;
}
function updateXPBar(){
    const required =
        getRequiredXP(profile.level);
    const percent =
        Math.min(
            (profile.xp / required) * 100,
            100
        );
    xpFill.style.width =
        percent + "%";
    xpText.textContent =
        `${profile.xp} / ${required} XP`;
}
function updateStats(){
    playerName.textContent =
        profile.nickname;
    playerLevel.textContent =
        profile.level;
    completedChallenges.textContent =
        profile.completedChallenges;
    points.textContent =
        profile.totalPoints;
    streak.textContent =
        profile.streak;
    badges.textContent =
        profile.badges.length;
    updateXPBar();
}
loadProfile();
updateStats();
function checkLevelUp(){
    let required = getRequiredXP(profile.level);
    while(profile.xp >= required){
        profile.xp -= required;
        profile.level++;
        addActivity(
            `🎉 Livello ${profile.level} raggiunto!`
        );
        required = getRequiredXP(profile.level);
    }
}
function addXP(amount){
    profile.xp += amount;
    profile.totalPoints += amount;
    checkLevelUp();
    updateStats();
    updateProgress();
    updateBadges();
    saveProfile();
}
function completeChallenge(pointsEarned){
    profile.completedChallenges++;
    profile.streak++;
    addXP(pointsEarned);
    addActivity(
        `✅ Challenge completata (+${pointsEarned} XP)`
    );
}
function addActivity(text){
    profile.activity.unshift(text);
    if(profile.activity.length > 15){
        profile.activity.pop();
    }
    renderActivity();
}
function renderActivity(){
    activityList.innerHTML = "";
    profile.activity.forEach(item=>{
        const li =
            document.createElement("li");
        li.textContent = item;
        activityList.appendChild(li);
    });
}
const badgeRules = [
    {
        id:0,
        xp:10
    },
    {
        id:1,
        xp:100
    },
    {
        id:2,
        xp:250
    },
    {
        id:3,
        xp:500
    },
    {
        id:4,
        xp:1000
    },
    {
        id:5,
        xp:2000
    },
    {
        id:6,
        xp:3500
    },
    {
        id:7,
        xp:5000
    }
];
function updateBadges(){
    const elements =
        document.querySelectorAll(".badge");
    badgeRules.forEach((rule,index)=>{
        if(profile.totalPoints >= rule.xp){
            if(!profile.badges.includes(index)){
                profile.badges.push(index);
                addActivity(
                    "🏅 Nuovo badge sbloccato!"
                );
            }
        }
    });
    elements.forEach((badge,index)=>{
        if(profile.badges.includes(index)){
            badge.classList.remove("locked");
            badge.classList.add("unlocked");
        }
    });
    badges.textContent =
        profile.badges.length;
}
function updateProgress(){
    const beginner =
        document.querySelector(".progress-fill.beginner");
    const intermediate =
        document.querySelector(".progress-fill.intermediate");
    const advanced =
        document.querySelector(".progress-fill.advanced");
    const expert =
        document.querySelector(".progress-fill.expert");
    beginner.style.width =
        Math.min(profile.completedChallenges*10,100) + "%";
    intermediate.style.width =
        Math.max(
            Math.min(
                (profile.completedChallenges-10)*10,
                100
            ),
            0
        ) + "%";
    advanced.style.width =
        Math.max(
            Math.min(
                (profile.completedChallenges-20)*10,
                100
            ),
            0
        ) + "%";
    expert.style.width =
        Math.max(
            Math.min(
                (profile.completedChallenges-30)*10,
                100
            ),
            0
        ) + "%";
}
function checkLevelUp(){
    let required = getRequiredXP(profile.level);
    while(profile.xp >= required){
        profile.xp -= required;
        profile.level++;
        addActivity(
            `🎉 Livello ${profile.level} raggiunto!`
        );
        required = getRequiredXP(profile.level);
    }
}
function addXP(amount){
    profile.xp += amount;
    profile.totalPoints += amount;
    checkLevelUp();
    updateStats();
    updateProgress();
    updateBadges();
    saveProfile();
}
function completeChallenge(pointsEarned){
    profile.completedChallenges++;
    profile.streak++;
    addXP(pointsEarned);
    addActivity(
        `✅ Challenge completata (+${pointsEarned} XP)`
    );
}
function addActivity(text){
    profile.activity.unshift(text);
    if(profile.activity.length > 15){
        profile.activity.pop();
    }
    renderActivity();
}
function renderActivity(){
    activityList.innerHTML = "";
    profile.activity.forEach(item=>{
        const li =
            document.createElement("li");
        li.textContent = item;
        activityList.appendChild(li);
    });
}
const badgeRules = [
    {
        id:0,
        xp:10
    },
    {
        id:1,
        xp:100
    },
    {
        id:2,
        xp:250
    },
    {
        id:3,
        xp:500
    },
    {
        id:4,
        xp:1000
    },
    {
        id:5,
        xp:2000
    },
    {
        id:6,
        xp:3500
    },
    {
        id:7,
        xp:5000
    }
];
function updateBadges(){
    const elements =
        document.querySelectorAll(".badge");
    badgeRules.forEach((rule,index)=>{
        if(profile.totalPoints >= rule.xp){
            if(!profile.badges.includes(index)){
                profile.badges.push(index);
                addActivity(
                    "🏅 Nuovo badge sbloccato!"
                );
            }
        }
    });
    elements.forEach((badge,index)=>{
        if(profile.badges.includes(index)){
            badge.classList.remove("locked");
            badge.classList.add("unlocked");
        }
    });
    badges.textContent =
        profile.badges.length;
}
function updateProgress(){
    const beginner =
        document.querySelector(".progress-fill.beginner");
    const intermediate =
        document.querySelector(".progress-fill.intermediate");
    const advanced =
        document.querySelector(".progress-fill.advanced");
    const expert =
        document.querySelector(".progress-fill.expert");
    beginner.style.width =
        Math.min(profile.completedChallenges*10,100) + "%";
    intermediate.style.width =
        Math.max(
            Math.min(
                (profile.completedChallenges-10)*10,
                100
            ),
            0
        ) + "%";
    advanced.style.width =
        Math.max(
            Math.min(
                (profile.completedChallenges-20)*10,
                100
            ),
            0
        ) + "%";
    expert.style.width =
        Math.max(
            Math.min(
                (profile.completedChallenges-30)*10,
                100
            ),
            0
        ) + "%";
}
