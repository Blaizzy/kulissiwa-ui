export default defineNuxtRouteMiddleware((to) => {

    const user = useSupabaseUser();
    if (to.path === '/auth/emailVerification') {
        console.log('emailVerification');
        return navigateTo('auth/emailVerification')
    }
    if (!user.value) {
        return navigateTo('/login');
    } 

});
