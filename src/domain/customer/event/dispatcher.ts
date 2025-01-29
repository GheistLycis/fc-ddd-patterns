import EventDispatcherInterface from '../../@shared/event/event-dispatcher.interface'
import EventHandlerInterface from '../../@shared/event/handler/event-handler.interface'
import EventInterface from '../../@shared/event/handler/event.interface'

export default class CustomerEventDispatcher
	implements EventDispatcherInterface
{
	private eventHandlers: Record<string, EventHandlerInterface[]> = {}

	get getEventHandlers(): Record<string, EventHandlerInterface[]> {
		return this.eventHandlers
	}

	register(eventName: string, eventHandler: EventHandlerInterface): void {
		if (!this.eventHandlers[eventName]) this.eventHandlers[eventName] = []

		this.eventHandlers[eventName].push(eventHandler)
	}

	unregister(eventName: string, eventHandler: EventHandlerInterface): void {
		if (this.eventHandlers[eventName]) {
			const index = this.eventHandlers[eventName].indexOf(eventHandler)

			if (index !== -1) {
				this.eventHandlers[eventName].splice(index, 1)
			}
		}
	}

	unregisterAll(): void {
		this.eventHandlers = {}
	}

	notify(event: EventInterface): void {
		const { name } = event.constructor

		if (this.eventHandlers[name]) {
			this.eventHandlers[name].forEach(({ handle }) => handle(event))
		}
	}
}
