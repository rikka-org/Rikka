import sudo from "sudo-prompt"

/** Restarts the process with elevated permissions.
 * @returns boolean - Whether we are already elevated.
 */
export async function switchToRoot() {
    if (!process.getuid || process.getuid() !== 0) {
        console.log("Elevating permissions...");
        const options = {
            name: "Rikka",
        };

        await sudo.exec(`node ${process.argv[1]}`, options, function (error, stdout, stderr) {
            if (error) throw error;
            console.log('stdout: ' + stdout);
        });
        return false;
    }

    return true;
}
