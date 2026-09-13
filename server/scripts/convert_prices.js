"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inputDir = path_1.default.join(__dirname, '..', 'data', 'prix');
const outputFile = path_1.default.join(__dirname, '..', 'data', 'bibliotheque_prix.json');
function parseValue(value) {
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }
    if (!isNaN(Number(value))) {
        return parseFloat(value);
    }
    return value;
}
function parseLuaContent(content) {
    const lines = content.split(/\r?\n/);
    let stack = [];
    let currentObject = null;
    let inStructure = false;
    let result = null;
    const commentPattern = /--.*$/;
    const kvPattern = /^([a-zA-Z0-9_]+)\s*=\s*(.+?)(,)?$/;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        line = line.replace(commentPattern, '').trim();
        if (!line)
            continue;
        if (line.startsWith('M.STRUCTURE = {')) {
            inStructure = true;
            const rootObj = {};
            stack.push({ obj: rootObj, isArray: false });
            currentObject = rootObj;
            result = rootObj;
            continue;
        }
        if (!inStructure)
            continue;
        if (line.endsWith('{')) {
            const assignMatch = line.match(/^([a-zA-Z0-9_]+)\s*=\s*\{$/);
            if (assignMatch) {
                const key = assignMatch[1];
                if (key === 'children') {
                    const newArray = [];
                    currentObject[key] = newArray;
                    stack.push({ obj: newArray, isArray: true });
                    currentObject = newArray;
                }
                else {
                    const newObj = {};
                    currentObject[key] = newObj;
                    stack.push({ obj: newObj, isArray: false });
                    currentObject = newObj;
                }
            }
            else if (line === '{') {
                const newObj = {};
                if (Array.isArray(currentObject)) {
                    currentObject.push(newObj);
                }
                stack.push({ obj: newObj, isArray: false });
                currentObject = newObj;
            }
            continue;
        }
        if (line === '}' || line === '},') {
            stack.pop();
            if (stack.length === 0)
                break;
            currentObject = stack[stack.length - 1].obj;
            continue;
        }
        const match = line.match(kvPattern);
        if (match) {
            const key = match[1];
            let valueStr = match[2];
            const value = parseValue(valueStr);
            if (!Array.isArray(currentObject)) {
                currentObject[key] = value;
            }
            continue;
        }
    }
    return result;
}
function processNode(node) {
    if (!node)
        return;
    if (node.type === 'ARTICLE') {
        let nom = node.nom || '';
        let unite = node.unite || 'U';
        let prix = node.prix;
        const parts = nom.split('\\t'); // Note: double backslash if it was escaped in LUA string or single if literal tab
        let explicitUnit = null;
        let cleanNom = nom;
        if (parts.length > 1) {
            cleanNom = parts[0].trim();
            explicitUnit = parts[1].trim();
        }
        if (explicitUnit) {
            if (explicitUnit === 'm')
                unite = 'm';
            else if (explicitUnit === 'U')
                unite = 'U';
            else
                unite = explicitUnit;
        }
        else {
            const lowerNom = cleanNom.toLowerCase();
            if (lowerNom.match(/\b(m2|m²)\b/))
                unite = 'm2';
            else if (lowerNom.match(/\b(m3|m³)\b/))
                unite = 'm3';
            else if (lowerNom.match(/\bml\b/))
                unite = 'ml';
            else if (lowerNom.match(/\bforfait\b/))
                unite = 'Forfait';
            else if (lowerNom.match(/\bens\b/))
                unite = 'Ens';
            else if (lowerNom.match(/\bh\b/))
                unite = 'H';
        }
        const unitMap = {
            'm': 'm',
            'ml': 'ml',
            'm2': 'm2', 'm²': 'm2',
            'm3': 'm3', 'm³': 'm3',
            'u': 'U',
            'ens': 'Ens',
            'forfait': 'Forfait',
            'h': 'H'
        };
        node.unite = unitMap[unite.toLowerCase()] || unite;
        node.nom = cleanNom;
        if (typeof prix === 'string') {
            node.prix = parseFloat(prix);
        }
    }
    if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => processNode(child));
    }
}
const finalLibrary = {};
try {
    const files = fs_1.default.readdirSync(inputDir).filter(f => f.endsWith('.lua'));
    console.log(`Found ${files.length} Lua files.`);
    for (const file of files) {
        const content = fs_1.default.readFileSync(path_1.default.join(inputDir, file), 'utf8');
        const data = parseLuaContent(content);
        if (data) {
            processNode(data);
            finalLibrary[data.id] = data;
            console.log(`Processed ${file} -> ${data.id}`);
        }
        else {
            console.error(`Failed to parse ${file}`);
        }
    }
    fs_1.default.writeFileSync(outputFile, JSON.stringify(finalLibrary, null, 2), 'utf8');
    console.log(`Successfully wrote to ${outputFile}`);
}
catch (e) {
    console.error("Error:", e);
}
