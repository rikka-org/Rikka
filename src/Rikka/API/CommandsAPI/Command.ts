export default abstract class Command {
    abstract name: string;
    abstract description: string;

    abstract callback(): void;
}