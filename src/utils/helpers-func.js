const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');
const path = require('path');

const swapTextForRole = (role) => {
    //'operator', 'admin', 'courier', 'checker', 'receiver', 'super_admin', 'manager', 'main_manager'
    if (role === 'manager') return 'МЕНЕЖЕР';
    if (role === 'main_manager') return 'ГЛАВНЫЙ МЕНЕЖЕР';
    if (role === 'operator') return 'ОПЕРАТОР';
    if (role === 'courier') return 'КУРЬЕР';
    if (role === 'receiver') return 'ПОЛУЧАТЕЛЬ';
    if (role === 'checker') return 'ПОДТВЕРДИТЕЛЬ';
    if (role === 'admin') return 'АДМИН';
    if (role === 'super_admin') return 'СУПЕР АДМИН'
    return 'ДРУГОЕ';
}

const filterOrder = (status, districtIds) => ({
    status, 
    isVerified: true, 
    districtId: { $in: districtIds } 
});

const msgErrorStr = (msg, status) => JSON.stringify({msg, status});

const msgErrorParse = (error) => {
    try {
        return JSON.parse(error.message);
    } catch (e) {
        return {msg: 'Что то пошло не так', status: 500}
    }
};

const createJwtToken = (payload, secretKey, options) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, options, (err, token) => {
            if (err) 
                reject(err);

            resolve(token);
        })
    })
};

const verifyJwtToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) 
                reject({message: msgErrorStr('Токен не дествителен', 401)});

            resolve(decoded)
        });
    })
};

const createXlsxFile = (xlsxData, xlsxName, xlsxPath, sheetName) => {
    const xlsxFileName = `${xlsxName}.xlsx`;
    const xlsxFullPath = path.join(__dirname, `${xlsxPath}/${xlsxFileName}`);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(xlsxData);

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, xlsxFullPath);

    return xlsxFullPath;
}

const pTotalPriceAndCountByPreparation = (status = null, isVerified = null, startDate = null, endDate = null) => {
    const matchByStatus = status ? {status} : {};
    const matchByVerified = isVerified !== null ? {isVerified: !!isVerified} : {};
    const matchByDate = startDate && endDate ? { date: {$gte: startDate, $lte: endDate} } : {};
    return [
        { $match: {...matchByStatus, ...matchByVerified, ...matchByDate} },
        { $unwind: '$products' },
        { $lookup: {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'products.productId'
          }
        },
        { $unwind: '$products.productId' },
        { $project: {
            _id: '$products.productId._id',
            status: '$status',
            preparation: '$products.productId.nameUz',
            price: '$products.productId.price',
            count: '$products.count',
            date: '$date'
          }
        },
        { $group: {
            _id: '$preparation',
            totalPrice: {$sum: {$multiply: ['$price', '$count']}},
            quantity: {$sum: '$count'}
          }
        },
        { $sort: {_id: 1} }
    ]
}

const pCountByUser = (startDate = null, endDate = null, skip = null, limit = null, condition = null) => {
    const matchByDate = startDate && endDate ? { date: {$gte: startDate, $lte: endDate} } : {};
    const matchByCondition = condition ? {condition} : {};
    const skipLimit = skip && limit ? [
        { $skip: skip || 0 },
        { $limit: limit || 15 },
    ] : [];
    return [
        { $match: { ...matchByDate, ...matchByCondition } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        ...skipLimit,
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: '_id' } },
        { $unwind: '$_id' },
        { $project: { _id: '$_id._id', firstName: '$_id.firstName', lastName: '$_id.lastName', phone: '$_id.phone', quantityOrder: '$count' } },
        { $sort: { quantityOrder: -1 } }
    ]
}

const pTotalPriceByStatus = (startDate = null, endDate = null) => {
    const matchByDate = startDate && endDate ? { date: {$gte: startDate, $lte: endDate} } : {};
    return [
        { $match: {...matchByDate, isDeleted: {$in: [false, undefined]}} }, 
        { $group: { _id: '$status', total: { $sum: '$totalPrice' } } }, 
        { $sort: { _id: 1 } }
    ]
}

const pCountBySources = (startDate = null, endDate = null) => {
    const matchByDate = startDate && endDate ? { date: {$gte: startDate, $lte: endDate} } : {};
    return [
        { $match: { 
            sourceId: { $type: 'objectId' }, 
            isDeleted: {$in: [false, undefined]},
            ...matchByDate
        }}, 
        { $lookup: {
            from: 'sources',
            localField: 'sourceId',
            foreignField: '_id',
            as: 'sourceId'
        } }, 
       { $unwind: '$sourceId' }, 
        { $group: {
            _id: '$sourceId.sourceId',
            count: { $sum: 1 }
        } }, 
        { $lookup: {
            from: 'sources',
            localField: '_id',
            foreignField: '_id',
            as: '_id'
        } }, 
       { $unwind: '$_id' }, 
       { $sort: { _id: 1 } }
    ]
}

const pTotalPriceBySources = (startDate = null, endDate = null, sourceId = null, city = null) => {
    const matchByDate = startDate && endDate ? { date: {$gte: startDate, $lte: endDate} } : {};
    const matchByCategory = sourceId ? { 'sourceId.sourceId': mongoose.Types.ObjectId(sourceId) } : {};
    const matchByCity = city ? { 'regionId.city': city } : {};
    const defaultMatch = {isVerified: true, sourceId: { $type: 'objectId' }};

    const pipeline = sourceId ? [
        { $match: {...defaultMatch, ...matchByDate, isDeleted: {$in: [false, undefined]}} },
        { $lookup: {
            from: 'sources',
            localField: 'sourceId',
            foreignField: '_id',
            as: 'sourceId'
        } }, 
        { $unwind: '$sourceId' },
        { $lookup: {
            from: 'regions',
            localField: 'regionId',
            foreignField: '_id',
            as: 'regionId'
        } }, 
        { $unwind: '$regionId' },
        { $match: {...matchByCategory, ...matchByCity} },
        { $group: { _id: 'price', total: { $sum: '$totalPrice' } } }
    ] : [
        { $match: {...defaultMatch, ...matchByDate} },
        { $lookup: {
            from: 'regions',
            localField: 'regionId',
            foreignField: '_id',
            as: 'regionId'
        } }, 
        { $unwind: '$regionId' },
        { $match: {...matchByCity}},
        { $group: { _id: 'price', total: { $sum: '$totalPrice' } } }
    ];


    return pipeline;
}

const pCountByDate = (startDate = null, endDate = null, userId = null, preparationId = null) => {
    const matchByDate = startDate && endDate ? { date: {$gte: startDate, $lte: endDate} } : {};
    const matchByOperator = userId ? { userId: mongoose.Types.ObjectId(userId) } : {};
    const matchByPreparation = preparationId ? { 'products.productId': mongoose.Types.ObjectId(preparationId) } : {};
    return [
        { $match: {...matchByDate, ...matchByOperator, ...matchByPreparation, isDeleted: {$in: [false, undefined]}} }, 
        { $unwind: '$products' }, 
        { $match: {...matchByPreparation} }, 
        { $lookup: {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'products.productId'
        } },
        { $unwind: '$products.productId' },
        { $group: {
            _id: { 
                day: { $dayOfMonth: '$date' }, 
                month: { $month: '$date' }, 
                year: { $year: '$date' } 
            },
            count: { $sum: '$products.count' }
        } }, 
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]
}

const pCountByPreparation = (startDate = null, endDate = null, userId = null) => {
    const matchByDate = startDate && endDate ? { date: {$gte: startDate, $lte: endDate} } : {};
    const matchByOperator = userId ? { userId: mongoose.Types.ObjectId(userId) } : {};
    return [
        { $match: {...matchByDate, ...matchByOperator, isDeleted: {$in: [false, undefined]}} }, 
        { $unwind: '$products' }, 
        { $group: {
            _id: '$products.productId', 
            quantity: { $sum: '$products.count' } 
        } }, 
        { $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: '_id'
        } }, 
        { $unwind: '$_id' }, 
        { $sort: { quantity: -1 } }
    ]
}

const pPriceQuantity = (findOption = {}, districtsId = []) => {
    const objectDistrictsId = districtsId.length ? districtsId.map((item) => {
        return mongoose.Types.ObjectId(item);
    }) : [];

    const districtMatchFilter = objectDistrictsId.length ? [{ $match: { 'orderId.districtId': { $in: objectDistrictsId } } }] : [];

    return [
        { $match: { ...findOption } },
        { $lookup: { from: 'orders', localField: 'orderId', foreignField: '_id', as: 'orderId' } },
        { $unwind: '$orderId' },
        ...districtMatchFilter,
        { $group: { _id: 'custumId', priceQuantity: { $sum: '$orderId.totalPrice' }, ordersLength: { $sum: 1 } } }
    ]
}



const xlsxOrdersData = (orders, allProducts = [], dataStructureName = null) => {
    const statusRuLanguage = {
        active: 'Активный',
        courier_failure: 'Отказ (курьер)',
        delivered_success: 'Доставленный (курьер)',
        office_success: 'Доставленный (офис)',
        in_courier: 'У курьера',
        not_active: 'Не проверенный'
    }

    const strJoin = (arr, propName) => {
        let value = '';
        arr.forEach((item) => {
            const count = item.count !== 1 ? item.count : '';
            const itemValue = propName === 'product' ? `${item.productId ? item.productId.nameUz.toUpperCase() : 'null'} ${count}` : item.toUpperCase();
            value += `${itemValue} `
        });
        return value;
    };

    const receiveMainForXlsx = (products, productKey = null) => {
        if (productKey) {
            for (let i = 0; i < products.length; i++) {
                if (!products[i].productId) 
                    break;

                const { productId: { keyXlsx }, count } = products[i];
                
                if (keyXlsx === productKey) 
                    return count;
            };
    
            return '';
        };
    
        if (!productKey) {
            let productsOthers = '';
            for (let i = 0; i < products.length; i++) {
                if (!products[i].productId) break;
                
                const { productId: { keyXlsx, nameUz }, count } = products[i];
                if (!keyXlsx)
                    productsOthers += `${count} ${nameUz} `;
            };
            return productsOthers;
        };
    };

    const utcDateOrder = (date) => {
        const today = new Date(date);
    
        return {
            day: today.getUTCDate(),
            month: today.getUTCMonth() + 1,
            year: today.getUTCFullYear(),
            hours: today.getUTCHours(),
            minutes: today.getMinutes()
        };
    };

    return orders.map((item) => {
        const { 
            userId: {
                firstName: operatorFirstName,
                lastName: operatorLastName,
                phone: operatorPhone
            },
            firstName : clientFirstName, 
            lastName : clientLastName, 
            code, 
            products, 
            totalPrice, 
            source,
            regionId, 
            districtId, 
            address, 
            plot, 
            phones,
            sourceId,
            status,
            lastStatusDate,
            _doc: {histories}
        } = item;
        
        let historiesDate = '';
        histories.forEach((h) => {
            const { year, month, day, hours, minutes } = utcDateOrder(h.date);
            const statusText = statusRuLanguage[h.newStatus];
            if (statusText)
                historiesDate += `${statusText} ${day}.${month}.${year}, ${hours}:${minutes} => \n`;
        });

        const { year, month, day, hours, minutes } = utcDateOrder(lastStatusDate);
        const statusDate = `${year}.${month}.${day}, ${hours}:${minutes}`;
        const date = historiesDate.length ? historiesDate : statusDate;

        let productsXlsx = allProducts.reduce((pv, cv) => {
            return !cv.keyXlsx ? {...pv} : {...pv, [cv.nameUz]: receiveMainForXlsx(products, cv.keyXlsx)}
        }, {});
        
        if (dataStructureName === 'products')
            return {
                ID: `${code}`,
                ...productsXlsx,
                ПРОЧИЕ: `${receiveMainForXlsx(products)}`,
                ДАТА_ВРЕМЯ: date,
                ИМЯ_ОПЕРАТОРА: `${operatorFirstName} ${operatorLastName}`,
                ТЕЛ_ОПЕРАТОРА: operatorPhone
            }

        const statusProperty = dataStructureName === 'all' ? {Статус: statusRuLanguage[status] } : {};

        return {
            ID: `ID ${code}`,
            Препараты: `${strJoin(products, 'product')}`,
            Сумма: totalPrice,
            Область: regionId.nameUz.toUpperCase(),
            Город: '',
            Район: districtId._id ? districtId.nameUz.toUpperCase() : 'Туман о\'чирилган',
            Адрес: address.toUpperCase(),
            Дом: plot.toUpperCase(),
            Получатель: `${clientFirstName.toUpperCase()} ${clientLastName.toUpperCase()}`,
            Число_время: date,
            Подпись: '',
            Телефон: strJoin(phones, 'phone'),
            Имя_оператора: `${operatorFirstName.toUpperCase()} ${operatorLastName.toUpperCase()}`,
            Тел_оператора: operatorPhone,
            Источник: sourceId ? sourceId.name : source,
            ...statusProperty
        }
    });
};

module.exports = {
    swapTextForRole,
    filterOrder,
    msgErrorStr,
    msgErrorParse,
    pTotalPriceAndCountByPreparation,
    pCountByUser,
    pTotalPriceByStatus,
    pCountBySources,
    pTotalPriceBySources,
    pCountByDate,
    pCountByPreparation,
    pPriceQuantity,
    xlsxOrdersData,
    createJwtToken,
    verifyJwtToken,
    createXlsxFile
}