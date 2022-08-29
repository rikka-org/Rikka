import { writeFile } from "fs/promises";

const messages: { [key: string]: string } = {};

export function addMessage(key: string, message: string) {
  messages[key] = message;
}

export async function saveToFile(file: string) {
  const data = JSON.stringify(messages);
  await writeFile(file, data);
}
