import { Sequelize } from 'sequelize-typescript'
import Order from '../../../../domain/checkout/entity/order'
import OrderItem from '../../../../domain/checkout/entity/order_item'
import Customer from '../../../../domain/customer/entity/customer'
import Address from '../../../../domain/customer/value-object/address'
import Product from '../../../../domain/product/entity/product'
import CustomerModel from '../../../customer/repository/sequelize/customer.model'
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository'
import ProductModel from '../../../product/repository/sequelize/product.model'
import ProductRepository from '../../../product/repository/sequelize/product.repository'
import OrderItemModel from './order-item.model'
import OrderModel from './order.model'
import OrderRepository from './order.repository'

describe('Order repository test', () => {
	let sequelize: Sequelize

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
			sync: { force: true },
		})

		sequelize.addModels([
			OrderModel,
			OrderItemModel,
			CustomerModel,
			ProductModel,
		])
		await sequelize.sync()
	})

	afterEach(async () => await sequelize.close())

	it('should create a new order', async () => {
		const customerRepository = new CustomerRepository()
		const customer = new Customer('123', 'Customer 1')
		const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
		customer.changeAddress(address)
		await customerRepository.create(customer)

		const productRepository = new ProductRepository()
		const product = new Product('123', 'Product 1', 10)
		await productRepository.create(product)

		const orderItem = new OrderItem(
			'1',
			product.name,
			product.price,
			product.id,
			2
		)

		const order = new Order('123', '123', [orderItem])

		const orderRepository = new OrderRepository()
		await orderRepository.create(order)

		const orderModel = await OrderModel.findOne({
			where: { id: order.id },
			include: ['items'],
		})

		expect(orderModel.toJSON()).toStrictEqual({
			id: '123',
			customer_id: '123',
			total: order.total(),
			is_gift: false,
			items: [
				{
					id: orderItem.id,
					name: orderItem.name,
					price: orderItem.price,
					quantity: orderItem.quantity,
					order_id: '123',
					product_id: '123',
				},
			],
		})
	})

	it('should update an order', async () => {
		const customer = new Customer('customerId', 'customer')
		customer.Address = new Address('street', 1, 'zip', 'city')
		const product = new Product('productId', 'product', 1)
		const orderItems = [
			new OrderItem('orderItemId', 'orderItem', 1, product.id, 1),
		]
		const order = new Order('orderId', customer.id, orderItems)
		const customerRepository = new CustomerRepository()
		const productRepository = new ProductRepository()
		const orderRepository = new OrderRepository()
		await Promise.all([
			customerRepository.create(customer),
			productRepository.create(product),
		]).then(() => orderRepository.create(order))

		order.markAsGift()
		await orderRepository.update(order)

		const { is_gift } = await OrderModel.findByPk(order.id)
		expect(is_gift).toBe(true)
	})

	it('should find an order', async () => {
		const customer = new Customer('customerId', 'customer')
		customer.Address = new Address('street', 1, 'zip', 'city')
		const product = new Product('productId', 'product', 1)
		const orderItems = [
			new OrderItem('orderItemId', 'orderItem', 1, product.id, 1),
		]
		const order = new Order('orderId', customer.id, orderItems)
		const customerRepository = new CustomerRepository()
		const productRepository = new ProductRepository()
		const orderRepository = new OrderRepository()
		await Promise.all([
			customerRepository.create(customer),
			productRepository.create(product),
		]).then(() => orderRepository.create(order))

		const foundOrder = await orderRepository.find(order.id)

		expect(foundOrder).toStrictEqual(order)
	})

	it('should find an order', async () => {
		const customer = new Customer('customerId', 'customer')
		customer.Address = new Address('street', 1, 'zip', 'city')
		const product = new Product('productId', 'product', 1)
		const orderItems = [
			new OrderItem('orderItemId', 'orderItem', 1, product.id, 1),
		]
		const order = new Order('orderId', customer.id, orderItems)
		const customerRepository = new CustomerRepository()
		const productRepository = new ProductRepository()
		const orderRepository = new OrderRepository()
		await Promise.all([
			customerRepository.create(customer),
			productRepository.create(product),
		]).then(() => orderRepository.create(order))

		const foundOrder = await orderRepository.find(order.id)

		expect(foundOrder).toStrictEqual(order)
	})

	it('should find all orders', async () => {
		const customer = new Customer('customerId', 'customer')
		customer.Address = new Address('street', 1, 'zip', 'city')
		const product = new Product('productId', 'product', 1)
		const orders = [
			new Order('orderId', customer.id, [
				new OrderItem('orderItemId', 'orderItem', 1, product.id, 1),
			]),
			new Order('orderId2', customer.id, [
				new OrderItem('orderItemId2', 'orderItem2', 1, product.id, 1),
			]),
		]
		const customerRepository = new CustomerRepository()
		const productRepository = new ProductRepository()
		const orderRepository = new OrderRepository()
		await Promise.all([
			customerRepository.create(customer),
			productRepository.create(product),
		]).then(() =>
			Promise.all([
				orderRepository.create(orders[0]),
				orderRepository.create(orders[1]),
			])
		)

		const foundOrders = await orderRepository.findAll()

		expect(foundOrders).toStrictEqual(orders)
	})
})
