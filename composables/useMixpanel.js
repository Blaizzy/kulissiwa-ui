
import mixpanel from 'mixpanel-browser';

export default function useMixpanel() {

    const config = useRuntimeConfig();
    const mixpanelToken = config.public.mixpanel; // Adjust according to your configuration

    // Initialize Mixpanel only if it hasn't been initialized and the token is available
    if (mixpanelToken) {
        mixpanel.init(mixpanelToken, {
            // debug: true,
            track_pageview: false,
            persistence: 'localStorage',
            ignore_dnt: true
        });
    }

    const setUserProfile = (profile, once=false) => {
        if (once) {
            mixpanel.people.set_once(profile);
        } else {
            mixpanel.people.set(profile);
        }
    };

    // Composable function to track events
    const trackPageView = (properties) => {
        if (properties) {
            mixpanel.track_pageview(properties);
        } else {
            mixpanel.track_pageview();
        }
    };

    // Composable function to track events
    const trackEvent = (eventName, properties) => {
        if (properties){
            mixpanel.track(eventName, properties);
        } else {
            mixpanel.track(eventName);
        }
    };

    // Composable function to identify a user
    const identifyUser = (userId) => {
        mixpanel.identify(userId);
    };

    const resetUser = () => {
        mixpanel.reset();
    }

    return {
        trackPageView,
        trackEvent,
        identifyUser,
        setUserProfile,
        resetUser
    };
}
