import GenericRequest from "../../../powercord-git/src/fake_node_modules/powercord/http/GenericRequest";

export function get(url: string) {
    return new GenericRequest('GET', url);
}

export function post(url: string) {
    return new GenericRequest('POST', url);
}

export function put(url: string) {
    return new GenericRequest('PUT', url);
}

export function del(url: string) {
    return new GenericRequest('DELETE', url);
}

export function head(url: string) {
    return new GenericRequest('HEAD', url);
}
