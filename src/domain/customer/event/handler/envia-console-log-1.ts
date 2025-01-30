import EventHandlerInterface from '../../../@shared/event/handler/event-handler.interface'
import EventInterface from '../../../@shared/event/handler/event.interface'

export default class EnviaConsoleLog1Handler implements EventHandlerInterface {
	handle(event: EventInterface): void {
		console.log(
			`Esse é o primeiro console.log do evento: ${event.constructor.name}`
		)
	}
}
