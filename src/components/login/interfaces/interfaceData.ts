export interface Data {
    login: string;
    password: string;
    forgotPasswordLogin: string;
    errorLogin: boolean;
    errorPassword: boolean;
    errorCredentials: boolean;
    forgotPassword: boolean;
    spinnerLogin: HTMLElement | null;
    showSecondAuthPopup: boolean;
    secondAuthToken: string | null;
    dialogElement: null | any;
    googleAuthDisabled: boolean;
    microsoftAuthDisabled: boolean;
}