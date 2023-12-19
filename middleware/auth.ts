export default defineNuxtRouteMiddleware((to) => {

    const user = useSupabaseUser();
    if (to.path === '/auth/emailVerification') {
        return navigateTo('auth/emailVerification')
    }
    if (!user.value) {
        return navigateTo('/login');
    } 

});
