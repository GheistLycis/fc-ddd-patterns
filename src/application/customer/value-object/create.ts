import Address from '../../../domain/customer/value-object/address'

interface CreateCustomerProps {
	name: string
	active?: boolean
	address?: Address
}

export default class CreateCustomer {
	name: string
	active: boolean
	address?: Address

	constructor({ name, active, address }: CreateCustomerProps) {
		this.name = name
		this.active = active
		this.address = address
	}
}
