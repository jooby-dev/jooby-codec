import fs from 'node:fs';

const getCurrentTimeString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}.${month}${day}.${hours}${minutes}`;
};

const packageFile = './package.json';
const packageData = JSON.parse(fs.readFileSync(packageFile, 'utf-8'));


packageData.name = '@jooby-dev/jooby-codec';
packageData.version = getCurrentTimeString();

fs.writeFileSync(packageFile, JSON.stringify(packageData, null, '    '));
