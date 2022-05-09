import { writeFileSync } from "fs";

const messages: { [key: string]: string } = {};

export function addMessage(key: string, message: string) {
  messages[key] = message;
}

export function saveToFile(file: string) {
  const data = JSON.stringify(messages);
  writeFileSync(file, data);
}
