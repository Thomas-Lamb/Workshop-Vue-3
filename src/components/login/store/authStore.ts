import {defineStore} from "pinia";
import axios from 'axios';
import server from "../../../assets/authServer/authServer";
import { uuid } from "vue-uuid";
import {Credentials} from "../interfaces/interfaceLogin.ts";
import {useLaravelEchoStore} from "../../../stores/laravel-echo.ts";
import {useIDBStore} from "../../../stores/IDB-store.ts";

window.mix_config = JSON.parse('{"MIX_APP_URL":"'+server.qbv2_url+'","MIX_ECHO_SERVER_URL":"'+server.qbv2_url+'","MIX_ECHO_SERVER_PROXY":'+server.qbv2_proxy+',"MIX_ECHO_SERVER_PORT":"'+server.qbv2_port+'","MIX_APP_CHANNEL_ID":"base64:KGbyb8kswAOKJRp0kvOW/Ouokgv6ZN+VVvChS7EEWjU=","MIX_APP_MAX_FILES_QUICK_UPLOAD":5,"HAS_GOOGLE_OAUTH":false,"HAS_AZURE_OAUTH":false,"MATOMO_ENABLED":0,"MATOMO_HOST":"","MATOMO_SITEID":1,"MATOMO_TRACKER":"matomo,"}');

window.axios = axios.create({
    baseURL : window.mix_config.MIX_APP_URL
})

window.UUID = uuid

export const useAuthStore = defineStore('login',{
    state: () => {
        return {
            isAuth: sessionStorage.getItem('isAuth') ? sessionStorage.getItem('isAuth') : false,
            token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : null,
            baseUrl: window.mix_config.MIX_APP_URL+'/api',
            toastBaseError: null,
            user : sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')!) : [],
            permissions : sessionStorage.getItem('permissions') ? JSON.parse(sessionStorage.getItem('permissions')!) : [],
            schedulerParameters : sessionStorage.getItem('schedulerParameters') ? JSON.parse(sessionStorage.getItem('schedulerParameters')!) : null,
            externalSearch : sessionStorage.getItem('externalSearch') ? JSON.parse(sessionStorage.getItem('externalSearch')!) : {},
            listenerPermission : null,
            mixConfig : window.mix_config,
            dataUser: { token: null },
            screen: "",
            secondAuthToken: null,
            router: window.router,

            // V-IF
            showSecondAuthPopup: false,
            showPasswordNeedUpdate: false,
            showPasswordValidationDateExpired: false,
        };
    },
    actions: {
        isLogIn(){
            if (this.$state.isAuth !== false) {
                return true
            } else {
                return false
            }
        },
        checkUserIsLog(token: any) {
            return this.dataUser.token = token;
        },
        storeSessionInIndexDb() {
            const IDBStore = useIDBStore();
            IDBStore.upDateStoreInIndexedDbByKey(this.isAuth, "session", "isauth")
            IDBStore.upDateStoreInIndexedDbByKey(this.token, "session", "token")
        },
        checkSessionInIndexDb() {
            const IDBStore = useIDBStore();
            IDBStore.getStoreDataByKey("session", "isauth").then(response => {
                console.log(response)
                this.isAuth = response
                sessionStorage.setItem('isAuth', "true");
            })
            IDBStore.getStoreDataByKey("session", "token").then(response => {
                console.log(response)
                this.token = response
                if (this.token != null) {
                    sessionStorage.setItem('token', JSON.stringify(this.token));
                    window.router.push({
                        name: "todo"
                    })
                }
            })
        },
        authUser(data: any) {
            localStorage.clear();
            this.$state.isAuth = true;
            this.$state.token = data.success.token;
            this.$state.user = data.user;
            this.$state.permissions = data.permissions;
            this.$state.schedulerParameters = data.schedulerParameters;
            sessionStorage.setItem('token', data.success.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            sessionStorage.setItem('roles', JSON.stringify(data.roles));
            sessionStorage.setItem('isAuth', "1");
            sessionStorage.setItem('version', JSON.stringify(data.versions));
            sessionStorage.setItem('permissions', JSON.stringify(data.permissions));
            sessionStorage.setItem('schedulerParameters', JSON.stringify(data.schedulerParameters));
            sessionStorage.setItem('qrcodemode', "drawe");
            if (window.innerWidth < 540) {
                sessionStorage.setItem('screen', "mobile");
            }
            if (window.innerWidth >= 540 && window.innerWidth <= 1180) {
                sessionStorage.setItem('screen', "tablette");
            }


        },
        logoutUser() {
            localStorage.clear();
            if (navigator.onLine) {
                this.$state.isAuth = false;
                this.$state.token = null;
                this.$state.user = null;
                this.$state.permissions = null;
                this.$state.listenerPermission = null;
                this.$state.schedulerParameters = null;
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('roles');
                sessionStorage.removeItem('isAuth');
                sessionStorage.removeItem('version');
                sessionStorage.removeItem('permissions');
                sessionStorage.removeItem('schedulerParameters');
                sessionStorage.removeItem('externalSearch');
                sessionStorage.removeItem('qrcodemode');
                sessionStorage.removeItem('externalSearch');
                sessionStorage.removeItem('screen');
                //localStorage.setItem('logout',true);
                sessionStorage.clear();
            } else {
                sessionStorage.setItem('isAuth', "0");
            }

            useLaravelEchoStore().leaveAll() //stop all echo channels

            window.router.push({ name: "login" })
        },
        cleanExternalSearch() {
            this.removeExternalSearch();
        },
        removeExternalSearch() {
            this.$state.externalSearch = {};
            sessionStorage.removeItem('externalSearch');
        },
        secondAuthLogin(data: any) {
            let authData = data.dataSource;
            this.authUser(authData);
            //this.$patch("listenChannelPermission");
            if (typeof authData.user.date_terms_validation == "object" || typeof authData.user.ip_terms_validation == "object") {
                sessionStorage.removeItem('isAuth');
                data.router.push({
                    name: "rgpd"
                });
            } else {
                data.spinnerOn();
                if (this.$state.externalSearch && this.$state.externalSearch.type && this.$state.externalSearch.content) {
                    data.spinnerOff();
                    if (this.$state.externalSearch.type === "centralPanels") {
                        // centralpanelStore.addingCentralPanels(state.externalSearch.content);
                        setTimeout(() => {
                            // location.href = window.mix_config.MIX_APP_URL + '/#/' + state.externalSearch.type;
                        })
                    } else {
                        // location.href = window.mix_config.MIX_APP_URL + '/#/' + state.externalSearch.type;
                    }
                } else {
                    //if(window.innerWidth > 1180 ) {
                    this.router.push({
                        name: "Loading"
                    }).then(() => {
                        data.spinnerOff();
                    });
                    //}
                    /*  else if (window.innerWidth <= 1180 ) {
                        router.push({
                            name: "listMobile"
                        }).then(()=>{
                            spinnerOff();
                        });
                    } */
                }
            }
        },
        setShowSecondAuthPopup(value: boolean) {
            this.showSecondAuthPopup = value;
        },
        login(credentials: Credentials, showLoginSpinner: Function, hideLoginSpinner: Function, errorCredentials: Function) {
            // let router = dataLogin.router;
            showLoginSpinner()
            if (navigator.onLine) {
                axios.post(
                    window.mix_config.MIX_APP_URL+'/api/login', {
                        login: credentials.login,
                        password: credentials.password,
                    }
                ).then(({data}) => {
                    // that.setLocalStorageInfo(data); todo à voir, certainement index db
                    //Need new password
                    if (data.passwordNeedUpdate) {
                        //Show popup to update the password to the current parameters
                        this.showPasswordNeedUpdate = true
                        return;
                    }
                    if (data.validationDateExpired) {
                        //Show popup to update the password because it has expired(renewal or not connected since a long time)
                        this.showPasswordValidationDateExpired = true
                        return;
                    }
                    //Two Factor Auth
                    if (data.tokenSecondAuth) {
                        //Go for second auth
                        this.setShowSecondAuthPopup(true);
                        this.secondAuthToken = data.tokenSecondAuth
                    } else {
                        //go for direct login
                        this.authUser(data)
                        this.checkUserIsLog(data.success.token);
                        if (typeof data.user.date_terms_validation == "object" || typeof data.user.ip_terms_validation == "object") {
                            sessionStorage.removeItem('isAuth');
                            this.router?.push({
                                name: "rgpd"
                            });
                        } else {
                            if (this.$state.externalSearch && this.$state.externalSearch.type && this.$state.externalSearch.content) {
                                hideLoginSpinner();
                                if (this.$state.externalSearch.type === "centralPanels") {
                                    // centralpanelStore.addingCentralPanels(this.$state.externalSearch.content);
                                    setTimeout(() => {
                                        location.href = window.mix_config.MIX_APP_URL + '/#/' + this.$state.externalSearch.type;
                                    })
                                } else {
                                    location.href = window.mix_config.MIX_APP_URL + '/#/' + this.$state.externalSearch.type;
                                }
                            } else {
                                this.storeSessionInIndexDb()
                                useLaravelEchoStore();
                                window.router.push({
                                    name: "todo"
                                }).then(() => {
                                    hideLoginSpinner();
                                });
                            }
                        }
                        hideLoginSpinner()
                    }
                }).catch(error => {
                    if (error) {
                        console.error(error.message);
                        errorCredentials()
                        hideLoginSpinner()
                    }
                });
            } else {
                sessionStorage.setItem('isAuth', "true");
                sessionStorage.setItem('token', "azerty");
                window.router.push({
                    name: "todo"
                }).then(() => {
                    hideLoginSpinner();
                });
            }
        }
    },
    getters: {
        getUser(): any {
            return this.user
        },
        // getIsAuth(): boolean {
        //     return this.isAuth
        // }
    }

});
