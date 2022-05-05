export default class Setting {
    name: string;
    description: string;
    type: string;
    value: any;

    constructor(name: string, description: string, type: string) {
        this.name = name;
        this.description = description;
        this.type = type;
    }

    setValue(value: any) {
        this.value = value;
    }
}
