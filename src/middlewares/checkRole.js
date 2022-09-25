
module.exports = (permission) => {
    return (req, res, next) => {
        const { role } = req.user;

        const OPERATOR = role === 'operator';
        const COURIER = role === 'courier';
        const CHECKER = role === 'checker';
        const MANAGER = role === 'manager';
        const MAINMANAGER = role === 'main_manager';
        const ADMIN = role === 'admin';
        const SUPERADMIN = role === 'super_admin';
        const DIRECTOR = role === 'director';
        const LOWADMIN = role === 'low_admin';

        const errorMessage = { errorMessage: 'Вам нет доступа на это' };

        switch (permission) {
            case 'onlyOperator':
                if (OPERATOR) next();
                else res.status(401).json(errorMessage);
                break;
            case 'onlyCourier':
                if (COURIER) next();
                else res.status(401).json(errorMessage);
                break;
            case 'onlyChecker':
                if (CHECKER) next();
                else res.status(401).json(errorMessage);
                break;
            case 'onlyManager':
                if (MANAGER) next();
                else res.status(401).json(errorMessage);
                break;
            case 'onlyMainManager':
                if (MAINMANAGER) next();
                else res.status(401).json(errorMessage);
                break;
            case 'onlySuperAdmin':
                if (SUPERADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'AS':
                if (ADMIN || SUPERADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'ASLA':
                if (ADMIN || SUPERADMIN || LOWADMIN) next()
                else res.status(401).json(errorMessage)
                break;
            case 'DASLA':
                if (DIRECTOR || ADMIN || SUPERADMIN || LOWADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'CHAS':
                if (CHECKER || ADMIN || SUPERADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'CHASLA':
                if (CHECKER || ADMIN || SUPERADMIN || LOWADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'CAS':
                if (COURIER || ADMIN || SUPERADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'CASLA':
                if (COURIER || ADMIN || SUPERADMIN || LOWADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'OAS':
                if (OPERATOR || ADMIN || SUPERADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'OASLA':
                if (OPERATOR || ADMIN || SUPERADMIN || LOWADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'OMMMAS':
                if (OPERATOR || MANAGER || MAINMANAGER || ADMIN || SUPERADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'OMMMASLA':
                if (OPERATOR || MANAGER || MAINMANAGER || ADMIN || SUPERADMIN || LOWADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'MMAS':
                if (MAINMANAGER || ADMIN || SUPERADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'MMASLA':
                if (MAINMANAGER || ADMIN || SUPERADMIN || LOWADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'MMMAS':
                if (MANAGER || MAINMANAGER || ADMIN || SUPERADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            case 'MMMASLA':
                if (MANAGER || MAINMANAGER || ADMIN || SUPERADMIN || LOWADMIN) next();
                else res.status(401).json(errorMessage);
                break;
            default:
                res.status(401).json(errorMessage);
        }
    }
}