#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function question(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

function checkElectronInstalled(targetDir) {
  const nodeModulesPath = path.join(targetDir, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) return false;

  // Check direct path first
  let electronPath = path.join(nodeModulesPath, "electron");
  if (!fs.existsSync(electronPath)) {
    // Check pnpm structure
    const pnpmPath = path.join(nodeModulesPath, ".pnpm");
    if (fs.existsSync(pnpmPath)) {
      try {
        const entries = fs.readdirSync(pnpmPath);
        for (const entry of entries) {
          if (entry.startsWith("electron@")) {
            electronPath = path.join(pnpmPath, entry, "node_modules", "electron");
            if (fs.existsSync(electronPath)) break;
          }
        }
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
  }

  if (!fs.existsSync(electronPath)) return false;

  const platform = process.platform;
  const binaryName = platform === "win32" ? "electron.exe" : "electron";
  const binaryPath = path.join(electronPath, "dist", binaryName);
  return fs.existsSync(binaryPath);
}

async function main() {
  console.log("⚡ Electron + Vite CLI\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // Prompt for project name
    let projectName = await question(
      rl,
      "What is your project name? (my-electron-app): "
    );
    projectName = projectName.trim() || "my-electron-app";

    // Validate project name
    if (projectName.length === 0) {
      console.log("❌ Project name cannot be empty.");
      process.exit(1);
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
      console.log(
        "❌ Project name can only contain letters, numbers, underscores, and hyphens."
      );
      process.exit(1);
    }

    const targetDir = path.join(process.cwd(), projectName);

    // Check if directory already exists
    if (fs.existsSync(targetDir)) {
      console.error(`❌ Folder "${projectName}" already exists.`);
      process.exit(1);
    }

    // Prompt for git initialization
    const initGitAnswer = await question(
      rl,
      "Initialize git repository? (Y/n): "
    );
    const initGit =
      initGitAnswer.trim().toLowerCase() !== "n" &&
      initGitAnswer.trim().toLowerCase() !== "no";

    rl.close();

    console.log(`\n📁 Creating project in ${targetDir}...`);

    // Copy template directory
    const templateDir = path.join(__dirname, "template");
    fs.cpSync(templateDir, targetDir, { recursive: true });

    // Update package.json name in the new project
    const packageJsonPath = path.join(targetDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.name = projectName;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n"
    );

    console.log("📦 Installing dependencies with pnpm...");

    try {
      // Install dependencies with scripts enabled (required for Electron)
      // pnpm 10+ blocks scripts by default, so we need to allow them
      execSync("pnpm install --ignore-scripts=false", { 
        cwd: targetDir, 
        stdio: "inherit" 
      });
    } catch (error) {
      console.error("❌ Failed to install dependencies.");
      console.error("You can install them manually by running: pnpm install");
      process.exit(1);
    }

    // Verify Electron is installed (should be automatic now)
    console.log("\n🔍 Verifying Electron installation...");
    if (!checkElectronInstalled(targetDir)) {
      console.warn(
        "⚠ Electron binary not found. This may happen if pnpm still blocked the scripts."
      );
      console.warn(
        "   Run 'pnpm rebuild electron' in the project directory to install it."
      );
    } else {
      console.log("✓ Electron is properly installed");
    }

    // Initialize git if requested
    if (initGit) {
      console.log("\n🔧 Initializing git repository...");
      try {
        execSync("git init", { cwd: targetDir, stdio: "inherit" });
        execSync("git add .", { cwd: targetDir, stdio: "inherit" });
        execSync('git commit -m "Initial commit"', {
          cwd: targetDir,
          stdio: "inherit",
        });
        console.log("✓ Git repository initialized");
      } catch (error) {
        console.warn(
          "⚠ Failed to initialize git repository. You can do it manually later."
        );
      }
    }

    console.log("\n✅ Project created successfully!\n");
    console.log("Next steps:");
    console.log(`  cd ${projectName}`);
    console.log("  pnpm dev      # Start development server");
    console.log("  pnpm build    # Build for production");
    console.log("  pnpm start    # Launch Electron app\n");
  } catch (error) {
    rl.close();
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
