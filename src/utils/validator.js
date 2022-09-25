const { body, query } = require('express-validator');

exports.registerValidator = [
    body('firstName', 'Поля не дожен быть пустым').isLength({ min: 1 }),
    body('phone', 'Введите номер').isLength({ min: 1 }),
    body('role', 'Роль не выбран').isLength({ min: 1 }),
    body('login', 'Введите корректный логин').isLength({ min: 3 }).isAlphanumeric(),
    body('password', 'Поля должен иметь мин. 6 символов, и [0-9][a-Z]!').isLength({ min: 6 }).isAlphanumeric(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Пороль должен совпадать!');

        return true;
    })
];

exports.editUserValidator = [
    body('firstName', 'Поля не дожен быть пустым').isLength({ min: 1 }),
    body('phone', 'Введите номер').isLength({ min: 1 }),
    body('role', 'Роль не выбран').isLength({ min: 1 }),
    body('login', 'Введите корректный логин').isLength({ min: 3 }).isAlphanumeric(),
    body('password').custom((value, { req }) => {
        if (!value) {
            return true;
        } else {
            if (value.length >= 6) {
                if (value !== req.body.confirm) throw new Error('Пороль должен совпадать!');
            } else {
                throw new Error('Пороль должен иметь не менее 6 символов!');
            }
            
            return true;
        }
    })
]

exports.orderValidator = [
    body('firstName', 'Поля имя должен быть не менее 3 символов').isLength({ min: 3 }),
    body('address', 'Поля не должен быть пустым').isLength({ min: 1 }),
    body('plot', 'Поля не должен быть пустым').isLength({ min: 1 }),
    body('phones', 'Наберите хотябы одну номер').isLength({ min: 1 }),
    body('code', 'Не должен быть пустым').isLength({ min: 1 }),
    body('payment', 'Выберите способ оплаты').isLength({ min: 1 }),
    body('sourceId', 'Не должен быть пустым').isLength({ min: 1 }),
    body('regionId', 'Выберите вилоят').isLength({ min: 1 }),
    body('districtId', 'Выберите район').isLength({ min: 1 }),
    body('products').isLength({ min: 1 })
];

exports.sourceValidator = [
    body('name', 'Объязательное поле').isLength({ min: 1 })
]

exports.productValidator = [
    body('nameUz', 'Поля не должен быть пустым').isLength({ min: 1 })
];

exports.districtValidator = [
    body('regionId', 'Поля не должен быть пустым').isLength({ min: 1 }),
    body("nameUz", "Поля не дожен быть пустым").isLength({ min: 1 })
]

exports.editDistrictValidator = [
    body('nameUz', "Поля не дожен быть пустым").isLength({ min: 1 })
]

exports.regionValidator = [
    body('nameUz', "Поля не дожен быть пустым").isLength({ min: 1 })
]

exports.taskValidator = [
    body('userId', 'Выбрать оператора обязательное').isLength({ min: 1 }),
    body('name', 'Поля название обязательное').isLength({min: 1}),
    body('count', 'Поля кол-во обязательное').isLength({min: 1}),
    body('start').custom((start, {req}) => {
        const { end } = req.body;
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate > endDate)
            throw new Error('Время начало задачи должен больше время конце задачи')

        return true
    }),
    body('end', 'Вы должны выбрать время окончание задачи').isLength({min: 1})
]