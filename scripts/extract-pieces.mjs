import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pathToKernScores = `${__dirname}/../bach-wtc-fugues/kern/`;
const piecesYamlPath = `${__dirname}/../content/wtc/`;
const wtcDataYamlPath = `${__dirname}/../content/wtc-data.yaml`;

function getIdFromFilename(path) {
    return path.split(/[\\\/]/).pop().replace(/\..+$/, '');
}

function parseHumdrumReferenceRecords(humdrum) {
    let lines = humdrum.split(/\r?\n/);
    let output = {};
    for (let i = 0; i < lines.length; i++) {
        const matches = lines[i].match(/^!!!\s*([^:]+)\s*:\s*(.*)\s*$/);
        if (matches) {
            const existingValue = output[matches[1]];
            if (Array.isArray(existingValue)) {
                output[matches[1]].push(matches[2])
            } else if (!Array.isArray(existingValue) && typeof existingValue !== 'undefined') {
                output[matches[1]] = [existingValue, matches[2]]
            } else {
                output[matches[1]] = matches[2];
            }
        }
    }
    return output;
}

function getFiles(directory, fileList) {
    fileList = fileList || [];
    let files = fs.readdirSync(directory);
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    for (let i in files) {
        const name = `${directory}/${files[i]}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, fileList);
        } else {
            fileList.push(name);
        }
    }
    return fileList;
}

execSync(`mkdir -p ${piecesYamlPath}`);

const wtcData = yaml.load(fs.readFileSync(wtcDataYamlPath, 'utf8'));

getFiles(pathToKernScores).forEach(file => {
    const id = getIdFromFilename(file);
    console.log(id);

    const kern = fs.readFileSync(file, 'utf8').trim();
    const referenceRecords = parseHumdrumReferenceRecords(kern);

    const config = Object.assign({
        id,
        title: referenceRecords.OTL,
        localRawFile: `/kern/wtc/${id}.krn`,
        parts: parseInt(referenceRecords.parts, 10),
        bwv: referenceRecords.SCT.replace('BWV ', ''),
        book: parseInt((referenceRecords.OTL.match(/Book (1|2)/) || [])[1], 10),
        key: kern.match(/\*([a-hA-H][\#\-]*):/)?.[1] ?? null,
        meter: kern.match(/\*M(\d+\/\d+)/)?.[1] ?? null,
        nr: parseInt((referenceRecords.OTL.match(/Fugue (\d+)/) || [])[1], 10),
        subjectEndLineNumber: null,
    }, wtcData[id] ?? {});

    const stdout = execSync(`cat ${file} | lnnr | beat -ac | extractxx -I kern | ridx -LGTMId`).toString().trim();
    const lines = stdout.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
        const [lnnrToken, beatToken] = lines[i].split('\t');
        const lineNumber = parseInt(lnnrToken, 10);
        const beat = parseFloat(beatToken, 10);
        if (beat === config.subjectEndBeat) {
            config.subjectEndLineNumber = lineNumber;
            break;
        }
    }

    const configFilename = `${id}.yaml`;
    fs.writeFileSync(`${piecesYamlPath}${configFilename}`, yaml.dump(config, {
        indent: 4,
        lineWidth: -1,
        sortKeys: true,
    }));
 
});
