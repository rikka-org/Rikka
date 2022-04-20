export = (time: number) => {
    new Promise(resolve => setTimeout(resolve, time));
}