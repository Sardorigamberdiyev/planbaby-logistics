
const monthSwitch = (id) => {
    switch (id) {
        case 1: return "Январ"
        case 2: return "Феврал";
        case 3: return "Март";
        case 4: return "Апрел";
        case 5: return "Май";
        case 6: return "Июнь";
        case 7: return "Июль";
        case 8: return "Август";
        case 9: return "Сентябр";
        case 10: return "Октябр";
        case 11: return "Ноябр";
        case 12: return "Декабр";
        default: return null;
    }
}

export default monthSwitch