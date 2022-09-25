exports.populatePaths = [
    {path: 'userId'}, 
    {path: 'orderId', populate: [
        {path: 'regionId'}, 
        {path: 'districtId'}, 
        {path: 'userId'}, 
        {path: 'products.productId'},
        {path: 'sourceId'}
    ]}
];

exports.populateOrder = 'userId regionId districtId products.productId sourceId';

exports.forAdminRoles = ['operator', 'courier', 'checker', 'receiver', 'manager', 'main_manager', 'low_admin'];