
export interface ImageDao {
    readonly putImage: (fileName: string, imageStringBase64Encoded: string) => Promise<string>;
    readonly getImage: (fileName: string) => Promise<string>;
}
