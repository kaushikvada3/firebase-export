const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const keyFile = "serviceAccountKey.json";
const exportFile = "exportTrials.js";

// STEP 1: Check if key file exists
if (!fs.existsSync(path.join(__dirname, keyFile))) {
  console.error(`❌ ERROR: ${keyFile} not found. Please place it in this folder and try again.`);
  process.exit(1);
}

const exportFolder = path.join(__dirname, "exported_results");
if (!fs.existsSync(exportFolder)) {
  fs.mkdirSync(exportFolder);
}

console.log("✅ serviceAccountKey.json found");

// STEP 2: Initialize npm project if needed
if (!fs.existsSync("package.json")) {
  console.log("📦 Initializing npm project...");
  execSync("npm init -y", { stdio: "inherit" });
}

// STEP 3: Install dependencies
console.log("📥 Installing dependencies: firebase-admin and exceljs...");
execSync("npm install firebase-admin exceljs", { stdio: "inherit" });

// STEP 4: Write exportTrials.js
console.log("📝 Writing exportTrials.js...");

fs.writeFileSync(exportFile, `\
const admin = require("firebase-admin");
const fs = require("fs");
const ExcelJS = require("exceljs");
const path = require("path");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportEachUserToExcel() {
  const usersSnapshot = await db.collection("users").get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const sessionsRef = db.collection("users").doc(userId).collection("sessions");
    const sessionsSnapshot = await sessionsRef.get();

    const userTrials = [];

    for (const sessionDoc of sessionsSnapshot.docs) {
      const sessionId = sessionDoc.id;
      const data = sessionDoc.data();

      const {
        outcomeDuration,
        score,
        playerName,
        numTrials,
        stimulusDuration,
        difficulty,
        timestamp,
        trialDetails
      } = data;

      if (Array.isArray(trialDetails)) {
        trialDetails.forEach((trial, index) => {
          const trialRow = {
            userId,
            sessionId,
            trialIndex: index,
            outcomeDuration,
            score,
            playerName,
            numTrials,
            stimulusDuration,
            difficulty,
            timestamp,
            metricScore: data.metricScore,
            correctGuessLeft: data.correctGuessLeft,
            correctGuessRight: data.correctGuessRight,
            inCorrectGuessLeft: data.inCorrectGuessLeft,
            inCorrectGuessRight: data.inCorrectGuessRight,
            missedGuess: data.missedGuess,
            trial: trial.trial,
            correct: trial.correct,
            type: trial.type
          };
          userTrials.push(trialRow);
        });
      }
    }

    if (userTrials.length === 0) {
      console.log(\`⚠️ No trials for user \${userId}, skipping file.\`);
      continue;
    }

    userTrials.sort((a, b) => {
      const getNum = (s) => parseInt((s.match(/#(\\d+)/) || [])[1] || 0);
      const aNum = getNum(a.sessionId);
      const bNum = getNum(b.sessionId);
      if (aNum !== bNum) return aNum - bNum;
      return a.trialIndex - b.trialIndex;
    });

    await writeExcelFile(userTrials, path.join("exported_results", \`\${sanitize(userId)}.xlsx\`));
    console.log(\`✅ Exported \${sanitize(userId)}.xlsx\`);
  }
}

function sanitize(str) {
  return str.replace(/[<>:"/\\\\|?*\\x00-\\x1F]/g, "_");
}

async function writeExcelFile(rows, filename) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Trials");

  const columns = [
    { header: "userId", key: "userId" },
    { header: "sessionId", key: "sessionId" },
    { header: "trialIndex", key: "trialIndex" },
    { header: "outcomeDuration", key: "outcomeDuration" },
    { header: "score", key: "score" },
    { header: "playerName", key: "playerName" },
    { header: "numTrials", key: "numTrials" },
    { header: "stimulusDuration", key: "stimulusDuration" },
    { header: "difficulty", key: "difficulty" },
    { header: "timestamp", key: "timestamp" },
    { header: "metricScore", key: "metricScore" },
    { header: "correctGuessLeft", key: "correctGuessLeft" },
    { header: "correctGuessRight", key: "correctGuessRight" },
    { header: "inCorrectGuessLeft", key: "inCorrectGuessLeft" },
    { header: "inCorrectGuessRight", key: "inCorrectGuessRight" },
    { header: "missedGuess", key: "missedGuess" },
    { header: "trial", key: "trial" },
    { header: "correct", key: "correct" },
    { header: "type", key: "type" }
  ];

  worksheet.columns = columns;

  let sessionBlockStart = 2;
  rows.forEach((row, index) => {
    worksheet.addRow(row);
    const isLastRow = index === rows.length - 1;
    const nextSessionId = !isLastRow ? rows[index + 1].sessionId : null;
    if (row.sessionId !== nextSessionId) {
      if (sessionBlockStart < worksheet.lastRow.number) {
        worksheet.mergeCells(\`B\${sessionBlockStart}:B\${worksheet.lastRow.number}\`);
      }
      sessionBlockStart = worksheet.lastRow.number + 1;
    }
  });

  await workbook.xlsx.writeFile(filename);
}

exportEachUserToExcel().catch(console.error);
`);

console.log("🚀 Running export script...");
execSync(`node ${exportFile}`, { stdio: "inherit" });