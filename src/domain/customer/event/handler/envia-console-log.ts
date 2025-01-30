import EventHandlerInterface from '../../../@shared/event/handler/event-handler.interface'
import EventInterface from '../../../@shared/event/handler/event.interface'

export default class EnviaConsoleLogHandler implements EventHandlerInterface {
	handle(event: EventInterface): void {
		console.log(event.eventData)
	}
}
