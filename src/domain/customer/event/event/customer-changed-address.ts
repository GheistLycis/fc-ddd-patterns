import EventInterface from '../../../@shared/event/handler/event.interface'
import Address from '../../value-object/address'

interface Data {
	id: string
	name: string
	address: Address
}

export default class CustomerChangedAddress implements EventInterface {
	dataTimeOccurred: Date
	eventData: string

	constructor(eventData: Data) {
		const { id, name, address } = eventData

		this.dataTimeOccurred = new Date()
		this.eventData = `Endereço do cliente: ${id}, ${name} alterado para: ${address.toString()}`
	}
}
