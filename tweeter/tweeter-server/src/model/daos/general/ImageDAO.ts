export interface ImageDAO {
    putImage: (
        imageStringBase64: string,
        imageFileExtension: string,
        alias: string
    ) => Promise<string>;
}
