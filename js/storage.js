"use strict";
const STORAGE_PREFIX =
    "javascript-challenge";
const STORAGE_KEYS = {
    profile:
        `${STORAGE_PREFIX}-profile`,
    progress:
        `${STORAGE_PREFIX}-progress`,
    editor:
        `${STORAGE_PREFIX}-editor`,
    completed:
        `${STORAGE_PREFIX}-completed`,
    settings:
        `${STORAGE_PREFIX}-settings`
};
function save(key,data){
    try{
        localStorage.setItem(
            key,
            JSON.stringify(data)
        );
        return true;
    }
    catch(error){
        console.error(
            "Storage Save Error",
            error
        );
        return false;
    }
}
function load(key,defaultValue=null){
    try{
        const value =
            localStorage.getItem(key);
        if(value === null){
            return defaultValue;
        }
        return JSON.parse(value);
    }
    catch(error){
        console.error(
            "Storage Load Error",
            error
        );
        return defaultValue;
    }
}
function remove(key){
    localStorage.removeItem(key);
}
function exists(key){
    return localStorage.getItem(key) !== null;
}
function saveProfile(profile){
    return save(
        STORAGE_KEYS.profile,
        profile
    );
}
function loadProfile(){
    return load(
        STORAGE_KEYS.profile,
        {}
    );
}
function saveProgress(progress){
    return save(
        STORAGE_KEYS.progress,
        progress
    );
}
function loadProgress(){
    return load(
        STORAGE_KEYS.progress,
        {}
    );
}
function saveEditor(code){
    return save(
        STORAGE_KEYS.editor,
        code
    );
}
function loadEditor(){
    return load(
        STORAGE_KEYS.editor,
        ""
    );
}
function saveSettings(settings){
    return save(
        STORAGE_KEYS.settings,
        settings
    );
}
function loadSettings(){
    return load(
        STORAGE_KEYS.settings,
        {
            theme:"dark",
            language:"it",
            fontSize:15,
            autoSave:true
        }
    );
}
function saveCompleted(list){
    return save(
        STORAGE_KEYS.completed,
        list
    );
}
function loadCompleted(){
    return load(
        STORAGE_KEYS.completed,
        []
    );
}
function addCompleted(id){
    const completed =
        loadCompleted();
    if(
        !completed.includes(id)
    ){
        completed.push(id);
        saveCompleted(completed);
    }
    return completed;
}
function isCompleted(id){
    return loadCompleted()
        .includes(id);
}
function createBackup(){
    return{
        profile:
            loadProfile(),
        progress:
            loadProgress(),
        editor:
            loadEditor(),
        completed:
            loadCompleted(),
        settings:
            loadSettings(),
        createdAt:
            new Date()
            .toISOString()
    };
}
function downloadBackup(){
    const backup =
        createBackup();
    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type:
                "application/json"
            }
        );
    const url =
        URL.createObjectURL(blob);
    const link =
        document.createElement("a");
    link.href = url;
    link.download =
        "javascript-challenge-backup.json";
    link.click();
    URL.revokeObjectURL(url);
}
function restoreBackup(file){
    return new Promise(
        (resolve,reject)=>{
            const reader =
                new FileReader();
            reader.onload = ()=>{
                try{
                    const backup =
                        JSON.parse(
                            reader.result
                        );
                    if(backup.profile){
                        saveProfile(
                            backup.profile
                        );
                    }
                    if(backup.progress){
                        saveProgress(
                            backup.progress
                        );
                    }
                    if(backup.editor){
                        saveEditor(
                            backup.editor
                        );
                    }
                    if(backup.completed){
                        saveCompleted(
                            backup.completed
                        );
                    }
                    if(backup.settings){
                        saveSettings(
                            backup.settings
                        );
                    }
                    resolve(backup);
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
function clearAll(){
    Object.values(
        STORAGE_KEYS
    ).forEach(remove);
}
function getStorageSize(){
    let total = 0;
    Object.values(
        STORAGE_KEYS
    ).forEach(key=>{
        const value =
            localStorage.getItem(key);
        if(value){
            total += value.length;
        }
    });
    return total;
}
function getStorageInfo(){
    return{
        keys:
            STORAGE_KEYS,
        usedBytes:
            getStorageSize(),
        usedKB:
            (
                getStorageSize()/1024
            ).toFixed(2)
    };
}
window.Storage = {
    keys:
        STORAGE_KEYS,
    save,
    load,
    remove,
    exists,
    clearAll,
    saveProfile,
    loadProfile,
    saveProgress,
    loadProgress,
    saveEditor,
    loadEditor,
    saveSettings,
    loadSettings,
    saveCompleted,
    loadCompleted,
    addCompleted,
    isCompleted,
    createBackup,
    downloadBackup,
    restoreBackup,
    getStorageInfo
};
console.log(
    "💾 storage.js loaded"
);
