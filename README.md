## Getting Started

**Step 1:** Download the file `setup_and_export.js` and place it inside the `firebase-export` folder.  

**Step 2:** Once it's there, follow the rest of the instructions as outlined in this document.

## Full Setup Instructions

### Overview
This guide explains how to export user trial data from Firebase Firestore into Excel (.xlsx) files using the provided `setup_and_export.js` script. No programming experience is required.

### What You Need
- A computer with internet access (Mac or Windows)
- A Firebase Admin SDK Key file named `serviceAccountKey.json`
- About 10–15 minutes for first-time setup

### How to Get Your Firebase Admin Key
To run the script, you'll need a special file called `serviceAccountKey.json` that gives you access to your Firebase project:

1. Go to: [https://console.firebase.google.com](https://console.firebase.google.com)
2. Select your project from the dashboard.
3. Click the gear icon in the upper left and choose **Project Settings**.
4. Go to the **Service Accounts** tab.
5. Click the button that says **Generate new private key**.
6. Confirm and download the JSON file.
7. Rename the file to `serviceAccountKey.json`.

### Step 1: Prepare Your Folder
1. Create a folder on your Desktop named `firebase-export`.
2. Move your `serviceAccountKey.json` file into this folder.
3. Download or save the `setup_and_export.js` script into the same folder.

### Step 2: Install Node.js
- **Windows/Mac:** Visit [https://nodejs.org](https://nodejs.org), download the LTS version for your OS, and install it.

### Step 3: Run the Script

#### Windows:
```bash
cd Desktop\firebase-export
node setup_and_export.js
```

#### Mac:
```bash
cd ~/Desktop/firebase-export
node setup_and_export.js
```

### Step 4: See the Results
A new folder named `exported_results` will be created. Inside it, you’ll find Excel files like:
- `1.xlsx`
- `AnuGoel.xlsx`
- `kaushikvada.xlsx`

### Troubleshooting
- **ERROR: serviceAccountKey.json not found**  
  Make sure the key file is in the same folder and correctly named.

- **`node` is not recognized**  
  Node.js might not be installed. Get it from [https://nodejs.org](https://nodejs.org).

- **Nothing happens after running the script**  
  Make sure you're inside the correct folder when running it.

### 📁 Code Included in `setup_and_export.js`

*(Refer to the LaTeX document or file appendix for the complete code.)*
