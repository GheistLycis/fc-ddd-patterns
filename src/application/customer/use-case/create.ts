import { v4 as uuid } from 'uuid'
import EventDispatcherInterface from '../../../domain/@shared/event/event-dispatcher.interface'
import Customer from '../../../domain/customer/entity/customer'
import CustomerChangedAddress from '../../../domain/customer/event/events/customer-changed-address'
import CustomerCreated from '../../../domain/customer/event/events/customer-created'
import CustomerRepositoryInterface from '../../../domain/customer/repository/customer-repository.interface'
import CreateCustomer from '../value-object/create'

export default class CreateCustomerUseCase {
	constructor(
		private readonly customerRepository: CustomerRepositoryInterface,
		private readonly customerEventDispatcher: EventDispatcherInterface
	) {}

	async execute(payload: CreateCustomer): Promise<void> {
		const customer = new Customer(uuid(), payload.name)

		if (payload.address) {
			customer.changeAddress(payload.address)

			this.customerEventDispatcher.notify(
				new CustomerChangedAddress({
					id: customer.id,
					name: customer.name,
					address: customer.Address,
				})
			)

			if (payload.active) customer.activate()
		}

		return this.customerRepository.create(customer).then(() =>
			this.customerEventDispatcher.notify(
				new CustomerCreated({
					id: customer.id,
					name: customer.name,
				})
			)
		)
	}
}
