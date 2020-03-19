import { execSync } from "child_process"

export function log(msg: string) {
  console.log(`\n${msg}`)
}

export function exit(msg: string) {
  console.error(msg);
  process.exit(1);
};

// Executes the provided shell command and redirects stdout/stderr to the console
export function run(cmd: string, cwd: string) {
  return execSync(cmd, { encoding: "utf8", stdio: "inherit", cwd })
};

// Determines the current operating system (one of ["mac", "windows", "linux"])

type Platform = 'mac' | 'windows' | 'linux'

export function getPlatform(): Platform {
  switch (process.platform) {
    case "win32":
      return "windows";
    case "darwin":
      return "mac";
    default:
      return "linux";
  }
}

export function getEnv(name: string): string | null {
  return process.env[name.toUpperCase()] || null;
}

export function setEnv(name: string, value: string) {
  if (value) {
    process.env[name.toUpperCase()] = value.toString();
  }
}

type InputName = 'github_token' | 'package_root' | 'script_name'

export function getInput(name: InputName, required: true): string
export function getInput(name: InputName, required: false): string | null
export function getInput(name: InputName, required: boolean): string | null {
  const value = getEnv(`INPUT_${name}`)
  if (required && !value) {
    exit(`"${name}" input variable is not defined`);
  }

  return value;
}
