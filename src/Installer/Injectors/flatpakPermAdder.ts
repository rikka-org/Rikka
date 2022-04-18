import { spawn } from "node:child_process";

export async function addFlatpakPerms(packageName: string) {
    // Spawn flatpak override permissions
    const child = spawn("flatpak", ["override", packageName, `--filesystem=${process.cwd()}`]);
    child.stdout.on("data", data => {
        console.log(data.toString());
    });
    child.stderr.on("data", data => {
        console.error(data.toString());
    });
    child.on("close", code => {
        if (code !== 0) {
            throw new Error(`Failed to add flatpak permissions for ${packageName}`);
        }
    });
}
