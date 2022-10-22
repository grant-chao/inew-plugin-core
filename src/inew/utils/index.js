const isServer = typeof window === 'undefined';

export const isMac = () => {
    if(isServer) return false;
    return navigator.platform.toLowerCase().includes('mac');
}
