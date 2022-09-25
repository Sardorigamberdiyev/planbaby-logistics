
const userData = JSON.parse(window.localStorage.getItem('userData'));
const i18nextLng = window.localStorage.getItem('i18nextLng');
const token = userData ? userData.token : null;
const rToken = userData ? userData.rToken : null;
const initialCheckAuth = userData ? !!token : false;
const initialRole = userData ? userData.role : null;
const initialCurrentLang = i18nextLng || 'uz';

const initialState = {
    token: token,
    rToken: rToken,
    isAuthenticated: initialCheckAuth,
    role: initialRole,
    menuPageActive: 'admin',
    currentLang: initialCurrentLang,
    menu: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            const isAuth = !!action.payload.token;

            return {
                ...state,
                token: action.payload.token,
                rToken: action.payload.rToken,
                isAuthenticated: isAuth,
                role: action.payload.role
            }
        case 'LOGOUT':
            return {
                ...state,
                token: null,
                rToken: null,
                isAuthenticated: false,
                role: null
            }
        case 'CHANGE_MENU_PAGE':
            return {
                ...state,
                menuPageActive: action.isActive
            }
        case 'CHANGE_LANG_DATA':
            return {
                ...state,
                currentLang: action.currentLang
            }
        case "MENU":
            return {
                ...state,
                menu: action.menu
            }
        default:
            return state;
    }
}

export default reducer;