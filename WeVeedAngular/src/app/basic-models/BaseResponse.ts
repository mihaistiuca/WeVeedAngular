
export class PropertyError {
    public propertyName: string;
    public errors: string[] = [];
}

export class BaseResponse<T = void> {

    public isSuccess: boolean = false;
    public status: number;
    public generalErrors: string[] = [];
    public errors: PropertyError[] = [];
    public data: T;
}

export class IdResponse {

    public id: string;
}