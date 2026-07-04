"use strict";
const UI = {
    playerName:
        document.getElementById("playerName"),
    playerLevel:
        document.getElementById("playerLevel"),
    xpFill:
        document.getElementById("xpFill"),
    xpText:
        document.getElementById("xpText"),
    completedChallenges:
        document.getElementById("completedChallenges"),
    points:
        document.getElementById("points"),
    streak:
        document.getElementById("streak"),
    badges:
        document.getElementById("badges"),
    activityList:
        document.getElementById("activityList"),
    nickname:
        document.getElementById("nickname"),
    theme:
        document.getElementById("themeSelect")
};
function renderProfile(profile){
    if(UI.playerName){
        UI.playerName.textContent =
            profile.nickname;
    }
    if(UI.playerLevel){
        UI.playerLevel.textContent =
            profile.level;
    }
}
function renderXP(profile){
    const required =
        profile.level * 100;
    const percentage =
        Math.min(
            (profile.xp / required) * 100,
            100
        );
    if(UI.xpFill){
        UI.xpFill.style.width =
            percentage + "%";
    }
    if(UI.xpText){
        UI.xpText.textContent =
            `${profile.xp} / ${required} XP`;
    }
}
function renderStats(profile){
    if(UI.completedChallenges){
        UI.completedChallenges.textContent =
            profile.completedChallenges;
    }
    if(UI.points){
        UI.points.textContent =
            profile.totalPoints;
    }
    if(UI.streak){
        UI.streak.textContent =
            profile.streak;
    }
    if(UI.badges){
        UI.badges.textContent =
            profile.badges.length;
    }
}
function renderSettings(profile){
    if(UI.nickname){
        UI.nickname.value =
            profile.nickname;
    }
    if(UI.theme){
        UI.theme.value =
            profile.theme;
    }
}
function renderActivity(profile){
    if(!UI.activityList){
        return;
    }
    UI.activityList.innerHTML = "";
    profile.activity.forEach(item=>{
        const li =
            document.createElement("li");
        li.textContent = item;
        UI.activityList.appendChild(li);
    });
}
function renderBadges(profile){
    const badges =
        document.querySelectorAll(".badge");
    badges.forEach((badge,index)=>{
        badge.classList.remove(
            "locked",
            "unlocked"
        );
        if(profile.badges.includes(index)){
            badge.classList.add("unlocked");
        }
        else{
            badge.classList.add("locked");
        }
    });
}
function renderProgress(profile){
    const beginner =
        document.querySelector(".progress-fill.beginner");
    const intermediate =
        document.querySelector(".progress-fill.intermediate");
    const advanced =
        document.querySelector(".progress-fill.advanced");
    const expert =
        document.querySelector(".progress-fill.expert");
    if(beginner){
        beginner.style.width =
            Math.min(
                profile.completedChallenges * 10,
                100
            ) + "%";
    }
    if(intermediate){
        intermediate.style.width =
            Math.max(
                Math.min(
                    (profile.completedChallenges - 10) * 10,
                    100
                ),
                0
            ) + "%";
    }
    if(advanced){
        advanced.style.width =
            Math.max(
                Math.min(
                    (profile.completedChallenges - 20) * 10,
                    100
                ),
                0
            ) + "%";
    }
    if(expert){
        expert.style.width =
            Math.max(
                Math.min(
                    (profile.completedChallenges - 30) * 10,
                    100
                ),
                0
            ) + "%";
    }
}
function refreshUI(profile){
    renderProfile(profile);
    renderXP(profile);
    renderStats(profile);
    renderSettings(profile);
    renderActivity(profile);
    renderBadges(profile);
    renderProgress(profile);
}
