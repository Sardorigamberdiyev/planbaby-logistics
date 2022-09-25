
class ProductService {
    constructor(Product) {
        this.Product = Product
    }

    createProduct(nameUz, price) {
        const product = new this.Product({ nameUz, price });
        return product.save();
    }

    async editProduct(productId, nameUz, price) {
        try {
            const product = await this.Product.findById(productId);

            product.nameUz = nameUz;
            product.price = price;
    
            return product.save();
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async changePriority(productId, priority) {
        try {
            const product = await this.Product.findById(productId);

            product.priority = priority;
            await product.save();
            
            return Promise.resolve(product.nameUz)
        } catch (e) {
            return Promise.reject(e)
        }
    }
}

module.exports = ProductService