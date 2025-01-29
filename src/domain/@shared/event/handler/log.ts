import EventHandlerInterface from './event-handler.interface'
import EventInterface from './event.interface'

export default class EnviaConsoleLogHandler implements EventHandlerInterface {
	handle(event: EventInterface): void {
		console.log(event.eventData)
	}
}
