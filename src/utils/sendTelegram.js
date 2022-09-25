const axios = require('axios');
const config = require('config');
const Order = require('../models/order');

module.exports = async (order) => {
    try {
        const { firstName, lastName, address, plot, phones, products, code, payment, totalPrice, source, sourceId, comment, userId, regionId, districtId } = order;

        const tgBotToken = config.get('tokenTgBot');
        const chatId = config.get('tgChatId');

        let phonesForTg = '';
        for (let i = 0; i < phones.length; i++) {
            phonesForTg += `<b>Телефон${phones.length > 1 ? `-${i + 1}` : ''}</b>: ${phones[i]}\n`;
        }

        let productsForTg = '';
        for (let i = 0; i < products.length; i++) {
            productsForTg += `${products[i].productId.nameUz} ${products[i].count > 1 ? products[i].count : ''},\n`
        }

        let paymentValue = '';

        if (payment === 'spot') paymentValue = 'Нахт';
        if (payment === 'card') paymentValue = 'Карта';

        const regionText = regionId ? regionId.nameUz : '';
        const districtText = districtId ? districtId.nameUz : '';

        const text = `<b>Исм: </b>${firstName} ${lastName}\n\n<b>Вилоят: </b>${regionText}\n<b>Туман: </b>${districtText}\n<b>Адрес: </b>${address}, ${plot}\n${phonesForTg}<b>Маҳсулот: </b>ID ${code},\n${productsForTg}<b>Манба: </b>${sourceId ? sourceId.name : source}\n<b>Толов усули: </b>${paymentValue}\n<b>Нарҳи: </b>${totalPrice}\n<b>Коментария: </b>${comment}\n\n<b>Операторни исми: </b>${userId.firstName} ${userId.lastName}\n<b>Операторни телефони: </b>${userId.phone}`
        
        let tgBotUri = decodeURI(`https://api.telegram.org/bot${tgBotToken}/sendMessage?chat_id=${chatId}&parse_mode=html&text=${text}`);
        tgBotUri = encodeURI(tgBotUri);

        await axios.get(tgBotUri);
        const currentOrder = await Order.findById(order._id);
        currentOrder.isSendTelegram = true;
        return currentOrder.save();
    } catch (err) {
        return Promise.reject(err);
    } 
}