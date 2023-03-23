import Oidc from 'oidc-client';
class AuthService  {
    userManager;
    constructor() {
        debugger;
        this.userManager =  new  Oidc.UserManager({
            authority: 'https://devlogin.talygen.devlabs.com',
            //authority: 'https://localhost:44369/',
            client_id: 'talygenspa',
            redirect_uri:this.callbackFun(),// 'http://localhost:9000/callback',
            response_type: 'id_token token',
            scope: 'openid profile',
            post_logout_redirect_uri: 'http://localhost:9000',
            userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
            automaticSilentRenew: true,
            silent_redirect_uri: 'http://localhost:9000/static/silent-renew.html',
            accessTokenExpiringNotificationTime: 10,
        });
    }

    signIn (returnToUrl) {
        
        this.userManager.signinRedirect();
    }
    async authenticate(returnPath) {
        debugger;
        const user = await this.getUser(); //see if the user details are in local storage
        if (!!user) {
            //await useloggedUserInfo().setUser(user);
        } else {
            await this.signIn(returnPath);
        }
    }
    async logOut(){
        debugger;
        try {
            this.userManager.signoutRedirect().then( () => {
            });
            this.userManager.clearStaleState()
        }catch(error){
            console.log(error);
        }
    }
    async isLoggedIn() {
        const user = await this.userManager.getUser();
        return !!user && !user.expired;
      }
    async getUser() {
        try {
            const user = await this.userManager.getUser();
            return user.profile;
        } catch (err) {
            console.log(err);
        }
    }
    async callbackFun() {
        debugger;
        try {     
            var result = await this.userManager.signinRedirectCallback();
            console.log('result');
            var returnToUrl = '/';
            if (result.state !== undefined) { returnToUrl = result.state;}
            //this.$router.push({ path: returnToUrl });
        } catch (e) {
            this.userManager.clearStaleState();
            //localStorage.clear();
            console.log('error');
            console.log(e);
            //this.$router.push({ name: 'Unauthorized' });
        }
    }
    async CheckPrivilege(privilegeName, showalert, doredirect) {
        //return (privilegeName.toLocaleLowerCase().includes("deal"))?false: true;
        try{
        if (privilegeName == "" || privilegeName.length == 0) return true;
        let haspermission = true;
        //let data1 = http.instance.get(scriptUrl, { privilegeName: privilegeName });
        if (data1)
            if (!data1.hasPermission) {
                haspermission = false;
                 if (showalert) alert(data1.message);
            } else {
              //  if (doredirect) window.location = hrefLink;
                haspermission = true;
            }
        return haspermission;
        }catch(e){ return true}
    }
}
export default new AuthService();