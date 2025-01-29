import EventHandlerInterface from './event-handler.interface'
import EventInterface from './event.interface'

export default class EnviaConsoleLog1Handler implements EventHandlerInterface {
	handle(event: EventInterface): void {
		console.log(
			`Esse é o primeiro console.log do evento: ${event.constructor.name}`
		)
	}
}
