import EventHandlerInterface from './handler/event-handler.interface'
import EventInterface from './handler/event.interface'

export default interface EventDispatcherInterface {
	notify(event: EventInterface): void
	register(eventName: string, eventHandler: EventHandlerInterface): void
	unregister(eventName: string, eventHandler: EventHandlerInterface): void
	unregisterAll(): void
}
