import { ServerResponse } from '../Models/ServerResponse';
class HttpService {
    public port = 8880
    public endpoint = `${window.location.protocol}//${window.location.hostname}:${this.port}`


    public post = (path: string, requestBody: string, headers?: HeadersInit): Promise<ServerResponse | null> => {
        return fetch(`${this.endpoint}/${path}`, {
            method: 'POST',
            body: requestBody,
            headers: {...headers, 'Content-Type': 'application/json'}
        }).then((res) => {
            if (res.ok) {
                return res.json()
            }
            return null
        }).catch((err) => {
            console.log(err)
        })
    }

    public get = (path: string): Promise<ServerResponse | null> => {
        return fetch(`${this.endpoint}/${path}`, {
            method: 'GET'
        }).then((res) => {
            if (res.ok) {
                return res.json()
            }
            throw Error('response not ok')
        }).catch((err) => {
            console.log(err)
        })
    }

    public open = (path: string) => {
        window.open(`${this.endpoint}/${path}`);
    }
}
export default new HttpService()
