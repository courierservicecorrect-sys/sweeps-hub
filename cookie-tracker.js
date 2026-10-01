// cookie-tracker.js

function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');
    const cookieClose = document.getElementById('cookieClose');

    // Utility: Set standard first-party cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
    }

    // Utility: Extract URL query parameters (UTM tags, ref, etc.)
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        if (!queryString) return params;
        
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        return params;
    }

    // Collect environment & user telemetry
    function collectLocalTelemetry(consentChoice) {
        return {
            consent: {
                status: consentChoice,
                timestamp: new Date().toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            session: {
                pageUrl: window.location.href,
                referrer: document.referrer || 'Direct',
                queryParams: getQueryParams()
            },
            device: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                touchSupport: 'ontouchend' in document,
                deviceMemory: navigator.deviceMemory || 'Unknown'
            }
        };
    }

    // Check if consent choice already exists
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent && cookieConsent) {
        cookieConsent.classList.remove('hidden');
    }

    // Handle user consent choice
    const handleConsent = (choice) => {
        const telemetryPayload = collectLocalTelemetry(choice);

        // 1. Store structured JSON telemetry in localStorage
        localStorage.setItem('cookieConsent', JSON.stringify(telemetryPayload));

        // 2. Set simple browser status cookie
        setCookie('user_cookie_consent', choice, 365);

        // 3. Hide banner instantly
        if (cookieConsent) {
            cookieConsent.classList.add('hidden');
        }
    };

    // Attach button event listeners
    if (cookieAccept) cookieAccept.addEventListener('click', () => handleConsent('accepted'));
    if (cookieDecline) cookieDecline.addEventListener('click', () => handleConsent('declined'));
    if (cookieClose && cookieConsent) {
        cookieClose.addEventListener('click', () => cookieConsent.classList.add('hidden'));
    }
}

// Auto-initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeCookieConsent);
