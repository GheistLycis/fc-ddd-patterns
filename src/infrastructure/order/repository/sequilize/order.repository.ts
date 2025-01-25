import Order from '../../../../domain/checkout/entity/order'
import OrderItem from '../../../../domain/checkout/entity/order_item'
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface'
import OrderItemModel from './order-item.model'
import OrderModel from './order.model'

export default class OrderRepository implements OrderRepositoryInterface {
	async create(entity: Order): Promise<void> {
		await OrderModel.create(
			{
				id: entity.id,
				customer_id: entity.customerId,
				total: entity.total(),
				is_gift: entity.isGift,
				items: entity.items.map(item => ({
					id: item.id,
					name: item.name,
					price: item.price,
					product_id: item.productId,
					quantity: item.quantity,
				})),
			},
			{ include: [{ model: OrderItemModel }] }
		)
	}

	async update(entity: Order): Promise<void> {
		await OrderModel.update(
			{
				customer_id: entity.customerId,
				total: entity.total(),
				is_gift: entity.isGift,
			},
			{ where: { id: entity.id } }
		)
	}

	async find(id: string): Promise<Order> {
		return OrderModel.findByPk(id, {
			rejectOnEmpty: true,
			include: [{ model: OrderItemModel }],
		})
			.then(
				orderModel =>
					new Order(
						orderModel.id,
						orderModel.customer_id,
						orderModel.items.map(
							itemModel =>
								new OrderItem(
									itemModel.id,
									itemModel.name,
									itemModel.price,
									itemModel.product_id,
									itemModel.quantity
								)
						),
						orderModel.is_gift
					)
			)
			.catch(() => {
				throw new Error('Order not found')
			})
	}

	async findAll(): Promise<Order[]> {
		return OrderModel.findAll({
			include: [{ model: OrderItemModel }],
		}).then(orderModels =>
			orderModels.map(
				orderModel =>
					new Order(
						orderModel.id,
						orderModel.customer_id,
						orderModel.items.map(
							itemModel =>
								new OrderItem(
									itemModel.id,
									itemModel.name,
									itemModel.price,
									itemModel.product_id,
									itemModel.quantity
								)
						),
						orderModel.is_gift
					)
			)
		)
	}
}
