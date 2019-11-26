import {Statuses} from "../Models/Statuses";

export interface ServerResponse {
    name: string,
    message: string,
    status?: Statuses
}
