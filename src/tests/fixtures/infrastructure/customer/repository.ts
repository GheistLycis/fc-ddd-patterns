import Customer from '../../../../domain/customer/entity/customer'
import CustomerRepositoryInterface from '../../../../domain/customer/repository/customer-repository.interface'

export default class CustomerRepositoryFixture
	implements CustomerRepositoryInterface
{
	constructor(
		public create = jest.fn().mockResolvedValue(undefined),
		public update = jest.fn().mockResolvedValue(undefined),
		public find = jest.fn().mockResolvedValue(new Customer('id', 'name')),
		public findAll = jest
			.fn()
			.mockResolvedValue([new Customer('id', 'name')])
	) {}
}
