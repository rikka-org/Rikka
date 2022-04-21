import { InjectRikka } from "./Injectors/injector";

const branch = process.argv[2];

if (!branch) throw new Error("No branch specified");

InjectRikka(branch);
