"use strict";
const Validator = {};
function createResult(){
    return{
        success:false,
        output:[],
        error:null,
        executionTime:0,
        tests:[]
    };
}
function executeCode(source){
    const result =
        createResult();
    const logs = [];
    const originalLog =
        console.log;
    const originalWarn =
        console.warn;
    const originalError =
        console.error;
    console.log = (...args)=>{
        logs.push({
            type:"log",
            value:args
        });
    };
    console.warn = (...args)=>{
        logs.push({
            type:"warn",
            value:args
        });
    };
    console.error = (...args)=>{
        logs.push({
            type:"error",
            value:args
        });
    };
    const start =
        performance.now();
    try{
        const fn =
            new Function(source);
        fn();
        result.success = true;
    }
    catch(error){
        result.error = error;
    }
    const end =
        performance.now();
    result.executionTime =
        Math.round(end-start);
    result.output = logs;
    console.log =
        originalLog;
    console.warn =
        originalWarn;
    console.error =
        originalError;
    return result;
}
function assertEqual(actual,expected,message){
    return{
        passed:
            actual === expected,
        expected,
        actual,
        message
    };
}
function assertTrue(value,message){
    return{
        passed:!!value,
        expected:true,
        actual:value,
        message
    };
}
function assertFalse(value,message){
    return{
        passed:!value,
        expected:false,
        actual:value,
        message
    };
}
function getConsoleText(result){
    return result.output
        .map(item=>{
            return item.value
                .join(" ");
        })
        .join("\n");
}
function validateOutput(
    result,
    expected
){
    const output =
        getConsoleText(result)
            .trim();
    return assertEqual(
        output,
        expected.trim(),
        "Console Output"
    );
}
function resetValidation(result){
    result.tests = [];
}
function addTest(
    result,
    test
){
    result.tests.push(test);
}
function runTestSuite(result,testSuite){
    if(!Array.isArray(testSuite)){
        return result;
    }
    testSuite.forEach(test=>{
        try{
            const testResult =
                executeTest(test,result);
            addTest(
                result,
                testResult
            );
        }
        catch(error){
            addTest(
                result,
                {
                    passed:false,
                    message:test.name ||
                        "Unknown Test",
                    expected:null,
                    actual:error.message
                }
            );
        }
    });
    return result;
}
function executeTest(test,result){
    switch(test.type){
        case "console":
            return validateOutput(
                result,
                test.expected
            );
        case "variable":
            return validateVariable(
                test
            );
        case "function":
            return validateFunction(
                test
            );
        case "array":
            return validateArray(
                test
            );
        case "object":
            return validateObject(
                test
            );
        case "json":
            return validateJSON(
                test
            );
        default:
            return{
                passed:false,
                message:
                    "Test sconosciuto."
            };
    }
}
function validateVariable(test){
    const value =
        window[test.name];
    return assertEqual(
        value,
        test.expected,
        `Variabile ${test.name}`
    );
}
function validateFunction(test){
    const fn =
        window[test.name];
    if(typeof fn !== "function"){
        return{
            passed:false,
            expected:"function",
            actual:typeof fn,
            message:
                `${test.name} non trovata`
        };
    }
    const result =
        fn(...(test.arguments || []));
    return assertEqual(
        result,
        test.expected,
        `${test.name}()`
    );
}
function validateArray(test){
    const value =
        window[test.name];
    if(!Array.isArray(value)){
        return{
            passed:false,
            expected:"Array",
            actual:typeof value,
            message:
                `${test.name} non è un array`
        };
    }
    return{
        passed:
            JSON.stringify(value) ===
            JSON.stringify(test.expected),
        expected:test.expected,
        actual:value,
        message:test.name
    };
}
function validateObject(test){
    const value =
        window[test.name];
    return{
        passed:
            JSON.stringify(value) ===
            JSON.stringify(test.expected),
        expected:test.expected,
        actual:value,
        message:test.name
    };
}
function validateJSON(test){
    try{
        const value =
            JSON.parse(
                window[test.name]
            );
        return{
            passed:
                JSON.stringify(value) ===
                JSON.stringify(test.expected),
            expected:test.expected,
            actual:value,
            message:test.name
        };
    }
    catch{
        return{
            passed:false,
            expected:"JSON valido",
            actual:"Errore parsing",
            message:test.name
        };
    }
}
function calculateScore(result){
    if(result.tests.length === 0){
        return 0;
    }
    const passed =
        result.tests.filter(
            test => test.passed
        ).length;
    return Math.round(
        (passed / result.tests.length) * 100
    );
}
function createReport(result){
    return{
        success:
            result.tests.every(
                test=>test.passed
            ),
        score:
            calculateScore(result),
        executionTime:
            result.executionTime,
        tests:
            result.tests,
        output:
            getConsoleText(result),
        error:
            result.error
    };
}
function buildSuggestions(report){
    const suggestions = [];
    report.tests.forEach(test=>{
        if(test.passed){
            return;
        }
        suggestions.push(
            `${test.message}
Atteso: ${JSON.stringify(test.expected)}
Ricevuto: ${JSON.stringify(test.actual)}`
        );
    });
    return suggestions;
}
function renderReport(report){
    const container =
        document.getElementById(
            "validationResult"
        );
    if(!container){
        return;
    }
    container.className =
        report.success
            ? "success"
            : "error";
    let html = "";
    html +=
        `<strong>Punteggio:</strong>
        ${report.score}%<br>`;
    html +=
        `<strong>Tempo:</strong>
        ${report.executionTime} ms<br><br>`;
    report.tests.forEach(test=>{
        html +=
        `${test.passed ? "✅" : "❌"}
        ${test.message}<br>`;
    });
    if(report.error){
        html +=
        `<br><strong>Errore:</strong>
        ${report.error.message}`;
    }
    container.innerHTML = html;
}
function validate(source,testSuite){
    const result =
        executeCode(source);
    resetValidation(result);
    runTestSuite(
        result,
        testSuite
    );
    const report =
        createReport(result);
    report.suggestions =
        buildSuggestions(report);
    renderReport(report);
    return report;
}
window.Validator = {
    executeCode,
    validate,
    validateOutput,
    validateVariable,
    validateFunction,
    validateArray,
    validateObject,
    validateJSON,
    createReport,
    calculateScore,
    buildSuggestions
};
console.log(
    "✔ validator.js loaded"
);
