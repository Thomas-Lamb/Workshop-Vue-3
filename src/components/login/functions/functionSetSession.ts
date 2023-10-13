export function setSession(data: any) {
    console.log('functionSetSession')
    localStorage.clear();
    // this.$state.isAuth = true;
    // this.$state.token =data.success.token;
    // this.$state.user = data.user;
    // this.$state.permissions = data.permissions;
    // this.$state.schedulerParameters = data.schedulerParameters;
    sessionStorage.setItem('token', data.success.token);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    sessionStorage.setItem('roles', JSON.stringify(data.roles));
    sessionStorage.setItem('isAuth', "1");
    sessionStorage.setItem('version', JSON.stringify(data.versions));
    sessionStorage.setItem('permissions',JSON.stringify(data.permissions));
    sessionStorage.setItem('schedulerParameters',JSON.stringify(data.schedulerParameters));
    sessionStorage.setItem('qrcodemode',"drawe");
    // if(window.innerWidth < 540) {
    //     sessionStorage.setItem('screen',"mobile");
    // }
    // if(window.innerWidth >= 540 && window.innerWidth <= 1180) {
    //     sessionStorage.setItem('screen',"tablette");
    // }
}