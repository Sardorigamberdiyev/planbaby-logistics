
const login = (token, rToken, role) => {
    localStorage.setItem('userData', JSON.stringify({ token, rToken, role }));

    return {
        type: 'LOGIN',
        payload: {
            token,
            rToken,
            role
        }
    }
}

const logout = () => {
    localStorage.removeItem('userData');

    return { type: 'LOGOUT' }
}

const changeMenuPage = (activePage) => {
    return {
        type: 'CHANGE_MENU_PAGE',
        isActive: activePage
    }
}

const changeLangData = (language) => {
    return {
        type: 'CHANGE_LANG_DATA',
        currentLang: language
    }
}

const menuChecked = (menu) => {
    return {
        type: 'MENU',
        menu: menu
    }
}

export {
    login,
    logout,
    changeMenuPage,
    changeLangData,
    menuChecked
}