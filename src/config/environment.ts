export default class Environment {
    public API_URL:string = process.env.API_URL as string;

    public getAPIAddress() {
        return this.API_URL;
    }
}