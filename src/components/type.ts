export interface TObject {
    [x:string]: any
}

export interface TComponent {
    name: string
    template: string
    props?: TObject
    data?: TObject
    methods?: TObject
    onMounted?: TObject
}