export interface IRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageFile?: {
        uri: string;
        name: string;
        type: string;
    };
}
