import EventInterface from '../../../@shared/event/handler/event.interface'

interface Data {
	id: string
	name: string
}

export default class CustomerCreated implements EventInterface {
	dataTimeOccurred: Date
	eventData: Data

	constructor(eventData: Data) {
		this.dataTimeOccurred = new Date()
		this.eventData = eventData
	}
}
