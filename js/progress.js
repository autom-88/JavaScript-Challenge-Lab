"use strict";
const PROGRESS_KEY =
    "javascript-challenge-progress";
const defaultProgress = {
    xp:0,
    level:1,
    completed:0,
    streak:0,
    lastLogin:null,
    categories:{
        beginner:0,
        intermediate:0,
        advanced:0,
        expert:0
    }
};
let progress = {
    ...defaultProgress
};
function loadProgress(){
    const saved =
        localStorage.getItem(
            PROGRESS_KEY
        );
    if(saved){
        try{
            progress = {
                ...defaultProgress,
                ...JSON.parse(saved)
            };
        }
        catch(error){
            console.error(error);
        }
    }
}
function saveProgress(){
    localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify(progress)
    );
}
function addXP(amount){
    if(amount <= 0){
        return;
    }
    progress.xp += amount;
    checkLevel();
    saveProgress();
}
function requiredXP(level){
    return level * 100;
}
function checkLevel(){
    while(
        progress.xp >=
        requiredXP(progress.level)
    ){
        progress.xp -=
            requiredXP(progress.level);
        progress.level++;
    }
}
function completeChallenge(){
    progress.completed++;
    saveProgress();
}
function getPercentage(){
    return Math.round(
        (progress.xp /
        requiredXP(progress.level))
        *100
    );
}
function getProgress(){
    return progress;
}
function getLevel(){
    return progress.level;
}
function getXP(){
    return progress.xp;
}
loadProgress();
function updateStreak(){
    const today =
        new Date()
        .toISOString()
        .split("T")[0];
    if(
        progress.lastLogin === today
    ){
        return;
    }
    const yesterday =
        new Date(
            Date.now() - 86400000
        )
        .toISOString()
        .split("T")[0];
    if(
        progress.lastLogin === yesterday
    ){
        progress.streak++;
    }
    else{
        progress.streak = 1;
    }
    progress.lastLogin = today;
    saveProgress();
}
function addCategoryProgress(category){
    if(
        !progress.categories.hasOwnProperty(
            category
        )
    ){
        return;
    }
    progress.categories[category]++;
    saveProgress();
}
function getCategoryProgress(category){
    return progress.categories[category] || 0;
}
function getTotalCategoryProgress(){
    return Object.values(
        progress.categories
    ).reduce(
        (total,value)=>
            total + value,
        0
    );
}
function getLevelName(){
    const level =
        progress.level;
    if(level < 5){
        return "Beginner";
    }
    if(level < 10){
        return "Intermediate";
    }
    if(level < 20){
        return "Advanced";
    }
    return "Expert";
}
function getStatistics(){
    return{
        xp:
            progress.xp,
        level:
            progress.level,
        streak:
            progress.streak,
        completed:
            progress.completed,
        percentage:
            getPercentage(),
        categories:
            {
                ...progress.categories
            },
        rank:
            getLevelName()
    };
}
function syncProgress(){
    if(
        window.UI &&
        window.profileApp
    ){
        UI.refreshUI({
            nickname:
                profileApp.profile?.nickname ||
                "Developer",
            level:
                progress.level,
            xp:
                progress.xp,
            completedChallenges:
                progress.completed,
            streak:
                progress.streak,
            totalPoints:
                progress.xp,
            badges:
                profileApp.profile?.badges ||
                [],
            activity:
                profileApp.profile?.activity ||
                [],
            theme:
                profileApp.profile?.theme ||
                "dark"
        });
    }
}
function resetProgress(){
    progress = {
        ...defaultProgress
    };
    saveProgress();
    syncProgress();
}
function exportProgress(){
    const data = JSON.stringify(
        progress,
        null,
        2
    );
    const blob = new Blob(
        [data],
        {
            type:"application/json"
        }
    );
    const url = URL.createObjectURL(blob);
    const link =
        document.createElement("a");
    link.href = url;
    link.download =
        "progress.json";
    link.click();
    URL.revokeObjectURL(url);
}
function importProgress(file){
    return new Promise(
        (resolve,reject)=>{
            const reader =
                new FileReader();
            reader.onload = ()=>{
                try{
                    progress = {
                        ...defaultProgress,
                        ...JSON.parse(
                            reader.result
                        )
                    };
                    saveProgress();
                    syncProgress();
                    resolve(progress);
                }
                catch(error){
                    reject(error);
                }
            };
            reader.onerror =
                reject;
            reader.readAsText(file);
        }
    );
}
function clearStorage(){
    localStorage.removeItem(
        PROGRESS_KEY
    );
}
function reloadProgress(){
    loadProgress();
    syncProgress();
}
window.Progress = {
    load:loadProgress,
    reload:reloadProgress,
    save:saveProgress,
    reset:resetProgress,
    addXP,
    completeChallenge,
    updateStreak,
    addCategoryProgress,
    getCategoryProgress,
    getTotalCategoryProgress,
    getStatistics,
    getLevel,
    getXP,
    getProgress,
    exportProgress,
    importProgress,
    clearStorage
};
updateStreak();
syncProgress();
console.log(
    "📈 progress.js loaded"
);
