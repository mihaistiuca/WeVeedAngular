
export class ProdSliderInfo {
    elements: ProdElementInfo[];
}

export class ProdElementInfo {

    public id: string;
    public producerName: string;
    public profileImageUrl: string;
    public isNew: boolean = false;

    public redirectUrl: string;

}