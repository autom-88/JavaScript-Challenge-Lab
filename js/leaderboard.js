"use strict";
const LEADERBOARD_KEY =
    "javascript-challenge-leaderboard";
let leaderboard = [];
const leaderboardBody =
    document.getElementById("leaderboardBody");
const playerPosition =
    document.getElementById("playerPosition");
const totalPlayers =
    document.getElementById("totalPlayers");
function loadLeaderboard(){
    if(window.Storage){
        leaderboard =
            Storage.load(
                LEADERBOARD_KEY,
                []
            );
    }
    else{
        leaderboard = JSON.parse(
            localStorage.getItem(
                LEADERBOARD_KEY
            ) || "[]"
        );
    }
}
function saveLeaderboard(){
    if(window.Storage){
        Storage.save(
            LEADERBOARD_KEY,
            leaderboard
        );
    }
    else{
        localStorage.setItem(
            LEADERBOARD_KEY,
            JSON.stringify(
                leaderboard
            )
        );
    }
}
function sortLeaderboard(){
    leaderboard.sort(
        (a,b)=>{
            if(
                b.totalPoints !==
                a.totalPoints
            ){
                return (
                    b.totalPoints -
                    a.totalPoints
                );
            }
            if(
                b.level !==
                a.level
            ){
                return (
                    b.level -
                    a.level
                );
            }
            return (
                b.completedChallenges -
                a.completedChallenges
            );
        }
    );
}
function renderLeaderboard(){
    if(!leaderboardBody){
        return;
    }
    leaderboardBody.innerHTML = "";
    sortLeaderboard();
    leaderboard.forEach(
        (player,index)=>{
            const tr =
                document.createElement(
                    "tr"
                );
            tr.innerHTML = `
                <td>${index+1}</td>
                <td>${player.nickname}</td>
                <td>${player.level}</td>
                <td>${player.totalPoints}</td>
                <td>${player.completedChallenges}</td>
                <td>${player.streak}</td>
            `;
            leaderboardBody.appendChild(
                tr
            );
        }
    );
    updateLeaderboardStats();
}
function createPlayer(profile){
    return{
        nickname:
            profile.nickname ||
            "Developer",
        level:
            profile.level || 1,
        totalPoints:
            profile.totalPoints || 0,
        completedChallenges:
            profile.completedChallenges || 0,
        streak:
            profile.streak || 0
    };
}
function updateLeaderboardStats(){
    if(totalPlayers){
        totalPlayers.textContent =
            leaderboard.length;
    }
}
loadLeaderboard();
renderLeaderboard();
function updatePlayer(profile){
    const player =
        createPlayer(profile);
    const index =
        leaderboard.findIndex(
            item =>
                item.nickname ===
                player.nickname
        );
    if(index >= 0){
        leaderboard[index] = {
            ...leaderboard[index],
            ...player,
            updatedAt: Date.now()
        };
    }
    else{
        leaderboard.push({
            id:
                crypto.randomUUID(),
            ...player,
            updatedAt: Date.now()
        });
    }
    saveLeaderboard();
    renderLeaderboard();
}
function removePlayer(nickname){
    leaderboard =
        leaderboard.filter(
            player =>
                player.nickname !== nickname
        );
    saveLeaderboard();
    renderLeaderboard();
}
function findPlayer(nickname){
    return leaderboard.find(
        player =>
            player.nickname === nickname
    );
}
function searchPlayer(search){
    search =
        search
        .trim()
        .toLowerCase();
    return leaderboard.filter(
        player =>
            player.nickname
            .toLowerCase()
            .includes(search)
    );
}
function filterByLevel(level){
    if(level === "all"){
        return leaderboard;
    }
    return leaderboard.filter(
        player =>
            player.level >= level
    );
}
function getTopThree(){
    sortLeaderboard();
    return leaderboard.slice(0,3);
}
function getPlayerPosition(nickname){
    sortLeaderboard();
    return (
        leaderboard.findIndex(
            player =>
                player.nickname ===
                nickname
        ) + 1
    );
}
function updatePlayerPosition(nickname){
    if(
        !playerPosition
    ){
        return;
    }
    playerPosition.textContent =
        getPlayerPosition(
            nickname
        );
}
function getLeaderboardStats(){
    if(
        leaderboard.length === 0
    ){
        return{
            players:0,
            highestXP:0,
            averageXP:0
        };
    }
    const highestXP =
        Math.max(
            ...leaderboard.map(
                p => p.totalPoints
            )
        );
    const averageXP =
        Math.round(
            leaderboard.reduce(
                (total,p)=>
                    total +
                    p.totalPoints,
                0
            ) /
            leaderboard.length
        );
    return{
        players:
            leaderboard.length,
        highestXP,
        averageXP
    };
}
function exportLeaderboard(){
    const data = JSON.stringify(
        leaderboard,
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
        "leaderboard.json";
    link.click();
    URL.revokeObjectURL(url);
}
function importLeaderboard(file){
    return new Promise(
        (resolve,reject)=>{
            const reader =
                new FileReader();
            reader.onload = ()=>{
                try{
                    leaderboard = JSON.parse(
                        reader.result
                    );
                    saveLeaderboard();
                    renderLeaderboard();
                    resolve(leaderboard);
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
function resetLeaderboard(){
    if(
        !confirm(
            "Vuoi eliminare tutta la classifica?"
        )
    ){
        return;
    }
    leaderboard = [];
    saveLeaderboard();
    renderLeaderboard();
}
function refreshLeaderboard(){
    loadLeaderboard();
    renderLeaderboard();
}
window.Leaderboard = {
    load:loadLeaderboard,
    save:saveLeaderboard,
    refresh:refreshLeaderboard,
    render:renderLeaderboard,
    update:updatePlayer,
    remove:removePlayer,
    find:findPlayer,
    search:searchPlayer,
    filter:filterByLevel,
    topThree:getTopThree,
    position:getPlayerPosition,
    statistics:getLeaderboardStats,
    export:exportLeaderboard,
    import:importLeaderboard,
    reset:resetLeaderboard
};
window.addEventListener(
    "storage",
    ()=>{
        refreshLeaderboard();
    }
);
console.log(
    "🏆 leaderboard.js loaded"
);
