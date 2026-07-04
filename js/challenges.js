"use strict";
const CHALLENGES_URL =
    "data/challenges.json";
let challenges = [];
let currentChallenge = null;
let currentIndex = 0;
const challengeTitle =
    document.getElementById("challengeTitle");
const challengeDifficulty =
    document.getElementById("challengeDifficulty");
const challengeDescription =
    document.getElementById("challengeDescription");
const challengeObjective =
    document.getElementById("challengeObjective");
const challengeStarter =
    document.getElementById("editor");
const challengeList =
    document.getElementById("challengeList");
async function loadChallenges(){
    try{
        const response =
            await fetch(CHALLENGES_URL);
        if(!response.ok){
            throw new Error(
                "Errore nel caricamento delle challenge."
            );
        }
        challenges =
            await response.json();
        renderChallengeList();
        selectChallenge(0);
    }
    catch(error){
        console.error(error);
    }
}
function selectChallenge(index){
    if(index < 0){
        return;
    }
    if(index >= challenges.length){
        return;
    }
    currentIndex = index;
    currentChallenge =
        challenges[index];
    renderChallenge();
}
function renderChallenge(){
    if(!currentChallenge){
        return;
    }
    if(challengeTitle){
        challengeTitle.textContent =
            currentChallenge.title;
    }
    if(challengeDifficulty){
        challengeDifficulty.textContent =
            currentChallenge.difficulty;
    }
    if(challengeDescription){
        challengeDescription.textContent =
            currentChallenge.description;
    }
    if(challengeObjective){
        challengeObjective.innerHTML = "";
        currentChallenge.objectives.forEach(item=>{
            const li =
                document.createElement("li");
            li.textContent = item;
            challengeObjective.appendChild(li);
        });
    }
    if(
        window.Editor &&
        currentChallenge.starterCode
    ){
        Editor.setCode(
            currentChallenge.starterCode
        );
    }
    updateSidebar();
}
function renderChallengeList(){
    if(!challengeList){
        return;
    }
    challengeList.innerHTML = "";
    challenges.forEach(
        (challenge,index)=>{
            const li =
                document.createElement("li");
            li.textContent =
                challenge.title;
            li.dataset.index =
                index;
            li.addEventListener(
                "click",
                ()=>{
                    selectChallenge(index);
                }
            );
            challengeList.appendChild(li);
        }
    );
}
function updateSidebar(){
    if(!challengeList){
        return;
    }
    [...challengeList.children]
    .forEach(
        (item,index)=>{
            item.classList.toggle(
                "active",
                index === currentIndex
            );
        }
    );
}
loadChallenges();
/*====================================================
    VALIDATE CHALLENGE
====================================================*/

async function validateCurrentChallenge(){

    if(!currentChallenge){

        return;

    }

    if(!window.Editor){

        return;

    }

    const userCode =
        Editor.getCode();

    try{

        const response =
            await fetch(

                "data/solutions.json"

            );

        if(!response.ok){

            throw new Error(

                "Impossibile caricare le soluzioni."

            );

        }

        const solutions =
            await response.json();

        const expected =
            solutions.find(

                item=>item.id===currentChallenge.id

            );

        if(!expected){

            showValidation(

                false,

                "Soluzione non disponibile."

            );

            return;

        }

        const passed =

            normalize(userCode) ===

            normalize(expected.code);

        if(passed){

            completeCurrentChallenge();

        }

        else{

            showValidation(

                false,

                "La soluzione non è ancora corretta."

            );

        }

    }

    catch(error){

        console.error(error);

    }

}

/*====================================================
    NORMALIZE
====================================================*/

function normalize(code){

    return code

        .replace(/\s+/g," ")

        .trim();

}

/*====================================================
    COMPLETE
====================================================*/

function completeCurrentChallenge(){

    showValidation(

        true,

        "🎉 Challenge completata!"

    );

    if(window.profileApp){

        profileApp.completeChallenge(

            currentChallenge.xp || 10

        );

    }

    saveCompletedChallenge();

}

/*====================================================
    VALIDATION PANEL
====================================================*/

function showValidation(success,message){

    const panel =

        document.getElementById(

            "validationResult"

        );

    if(!panel){

        return;

    }

    panel.className = "";

    panel.classList.add(

        success

            ? "success"

            : "error"

    );

    panel.textContent = message;

}

/*====================================================
    NEXT CHALLENGE
====================================================*/

function nextChallenge(){

    if(

        currentIndex + 1 >=

        challenges.length

    ){

        return;

    }

    selectChallenge(

        currentIndex + 1

    );

}

/*====================================================
    PREVIOUS CHALLENGE
====================================================*/

function previousChallenge(){

    if(currentIndex === 0){

        return;

    }

    selectChallenge(

        currentIndex - 1

    );

}

/*====================================================
    SAVE PROGRESS
====================================================*/

function saveCompletedChallenge(){

    const completed =

        JSON.parse(

            localStorage.getItem(

                "completedChallenges"

            ) || "[]"

        );

    if(

        !completed.includes(

            currentChallenge.id

        )

    ){

        completed.push(

            currentChallenge.id

        );

        localStorage.setItem(

            "completedChallenges",

            JSON.stringify(completed)

        );

    }

}

/*====================================================
    BUTTON EVENTS
====================================================*/

const validateButton =

    document.getElementById(

        "validateSolution"

    );

const nextButton =

    document.getElementById(

        "nextChallenge"

    );

const previousButton =

    document.getElementById(

        "previousChallenge"

    );

if(validateButton){

    validateButton.addEventListener(

        "click",

        validateCurrentChallenge

    );

}

if(nextButton){

    nextButton.addEventListener(

        "click",

        nextChallenge

    );

}

if(previousButton){

    previousButton.addEventListener(

        "click",

        previousChallenge

    );

}
async function validateCurrentChallenge(){
    if(!currentChallenge){
        return;
    }
    if(!window.Editor){
        return;
    }
    const userCode =
        Editor.getCode();
    try{
        const response =
            await fetch(
                "data/solutions.json"
            );
        if(!response.ok){
            throw new Error(
                "Impossibile caricare le soluzioni."
            );
        }
        const solutions =
            await response.json();
        const expected =
            solutions.find(
                item=>item.id===currentChallenge.id
            );
        if(!expected){
            showValidation(
                false,
                "Soluzione non disponibile."
            );
            return;
        }
        const passed =
            normalize(userCode) ===
            normalize(expected.code);
        if(passed){
            completeCurrentChallenge();
        }
        else{
            showValidation(
                false,
                "La soluzione non è ancora corretta."
            );
        }
    }
    catch(error){
        console.error(error);
    }
}
function normalize(code){
    return code
        .replace(/\s+/g," ")
        .trim();
}
function completeCurrentChallenge(){
    showValidation(
        true,
        "🎉 Challenge completata!"
    );
    if(window.profileApp){
        profileApp.completeChallenge(
            currentChallenge.xp || 10
        );
    }
    saveCompletedChallenge();
}
function showValidation(success,message){
    const panel =
        document.getElementById(
            "validationResult"
        );
    if(!panel){
        return;
    }
    panel.className = "";
    panel.classList.add(
        success
            ? "success"
            : "error"
    );
    panel.textContent = message;
}
function nextChallenge(){
    if(
        currentIndex + 1 >=
        challenges.length
    ){
        return;
    }
    selectChallenge(
        currentIndex + 1
    );
}
function previousChallenge(){
    if(currentIndex === 0){
        return;
    }
    selectChallenge(
        currentIndex - 1
    );
}
function saveCompletedChallenge(){
    const completed =
        JSON.parse(
            localStorage.getItem(
                "completedChallenges"
            ) || "[]"
        );
    if(
        !completed.includes(
            currentChallenge.id
        )
    ){
        completed.push(
            currentChallenge.id
        );
        localStorage.setItem(
            "completedChallenges",
            JSON.stringify(completed)
        );
    }
}
const validateButton =
    document.getElementById(
        "validateSolution"
    );
const nextButton =
    document.getElementById(
        "nextChallenge"
    );
const previousButton =
    document.getElementById(
        "previousChallenge"
    );
if(validateButton){
    validateButton.addEventListener(
        "click",
        validateCurrentChallenge
    );
}
if(nextButton){
    nextButton.addEventListener(
        "click",
        nextChallenge
    );
}
if(previousButton){
    previousButton.addEventListener(
        "click",
        previousChallenge
    );
}
