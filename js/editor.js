"use strict";
const EDITOR_STORAGE_KEY =
    "javascript-challenge-editor";
const editor = document.getElementById("editor");
const runButton =
    document.getElementById("runCode");
const resetButton =
    document.getElementById("resetCode");
const solutionButton =
    document.getElementById("showSolution");
const downloadButton =
    document.getElementById("downloadCode");
const consoleOutput =
    document.getElementById("consoleOutput");
let currentCode = "";
let isDirty = false;
function initializeEditor(){
    if(!editor){
        return;
    }
    loadEditor();
    updateEditorStats();
    editor.addEventListener(
        "input",
        handleEditorInput
    );
    editor.addEventListener(
        "keydown",
        handleShortcuts
    );
}
function handleEditorInput(){
    currentCode = editor.value;
    isDirty = true;
    autoSave();
    updateEditorStats();
}
function loadEditor(){
    const saved =
        localStorage.getItem(
            EDITOR_STORAGE_KEY
        );
    if(saved){
        editor.value = saved;
        currentCode = saved;
    }
}
function autoSave(){
    localStorage.setItem(
        EDITOR_STORAGE_KEY,
        editor.value
    );
}
function clearEditor(){
    editor.value = "";
    currentCode = "";
    autoSave();
    updateEditorStats();
}
function setCode(code){
    editor.value = code;
    currentCode = code;
    autoSave();
    updateEditorStats();
}
function getCode(){
    return editor.value;
}
function updateEditorStats(){
    if(!editor){
        return;
    }
    const text = editor.value;
    const lines =
        text.split("\n").length;
    const characters =
        text.length;
    const words =
        text.trim().length === 0
            ? 0
            : text.trim().split(/\s+/).length;
    console.log({
        characters,
        words,
        lines
    });
}
function handleShortcuts(event){
    if(event.ctrlKey && event.key === "s"){
        event.preventDefault();
        autoSave();
    }
    if(event.ctrlKey && event.key === "l"){
        event.preventDefault();
        clearEditor();
    }
}
initializeEditor();
function insertTab(event){
    if(event.key !== "Tab"){
        return;
    }
    event.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const value = editor.value;
    editor.value =
        value.substring(0,start) +
        "    " +
        value.substring(end);
    editor.selectionStart =
        editor.selectionEnd =
        start + 4;
    autoSave();
}
async function copyCode(){
    try{
        await navigator.clipboard.writeText(
            editor.value
        );
        if(window.UI){
            UI.showToast(
                "📋 Codice copiato",
                "success"
            );
        }
    }
    catch(error){
        console.error(error);
    }
}
function downloadCode(){
    const blob = new Blob(
        [editor.value],
        {
            type:"text/javascript"
        }
    );
    const url = URL.createObjectURL(blob);
    const a =
        document.createElement("a");
    a.href = url;
    a.download = "solution.js";
    a.click();
    URL.revokeObjectURL(url);
}
function resetEditor(){
    const ok = confirm(
        "Eliminare tutto il codice?"
    );
    if(!ok){
        return;
    }
    clearEditor();
    if(consoleOutput){
        consoleOutput.textContent = "";
    }
}
async function loadSolution(id){
    try{
        const response = await fetch(
            "data/solutions.json"
        );
        const solutions =
            await response.json();
        const solution =
            solutions.find(
                item => item.id === id
            );
        if(solution){
            setCode(solution.code);
            if(window.UI){
                UI.showToast(
                    "✅ Soluzione caricata",
                    "success"
                );
            }
        }
        else{
            if(window.UI){
                UI.showToast(
                    "⚠️ Soluzione non trovata",
                    "warning"
                );
            }
        }
    }
    catch(error){
        console.error(error);
    }
}
if(resetButton){
    resetButton.addEventListener(
        "click",
        resetEditor
    );
}
if(downloadButton){
    downloadButton.addEventListener(
        "click",
        downloadCode
    );
}
if(solutionButton){
    solutionButton.addEventListener(
        "click",
        ()=>{
            loadSolution(1);
        }
    );
}
if(editor){
    editor.addEventListener(
        "keydown",
        insertTab
    );
}
function runCode(){
    if(!editor){
        return;
    }
    if(consoleOutput){
        consoleOutput.textContent = "";
    }
    const output = [];
    const originalLog = console.log;
    console.log = function(...args){
        const message =
            args.map(value=>{
                if(typeof value === "object"){
                    try{
                        return JSON.stringify(
                            value,
                            null,
                            2
                        );
                    }
                    catch{
                        return String(value);
                    }
                }
                return String(value);
            }).join(" ");
        output.push(message);
        originalLog.apply(console,args);
    };
    try{
        new Function(editor.value)();
        if(consoleOutput){
            consoleOutput.textContent =
                output.length
                    ? output.join("\n")
                    : "✔ Esecuzione completata.";
        }
        if(window.UI){
            UI.showToast(
                "✔ Codice eseguito",
                "success"
            );
        }
    }
    catch(error){
        if(consoleOutput){
            consoleOutput.textContent =
                "❌ " + error.message;
        }
        if(window.UI){
            UI.showToast(
                "Errore durante l'esecuzione",
                "error"
            );
        }
    }
    finally{
        console.log = originalLog;
    }
}
function clearConsole(){
    if(consoleOutput){
        consoleOutput.textContent = "";
    }
}
function insertText(text){
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const value = editor.value;
    editor.value =
        value.substring(0,start) +
        text +
        value.substring(end);
    editor.selectionStart =
        editor.selectionEnd =
        start + text.length;
    autoSave();
}
if(runButton){
    runButton.addEventListener(
        "click",
        runCode
    );
}
window.Editor = {
    run:runCode,
    clear:clearEditor,
    clearConsole,
    getCode,
    setCode,
    insertText,
    loadSolution,
    downloadCode,
    copyCode,
    autoSave
};
console.log(
    "📝 editor.js loaded"
);
