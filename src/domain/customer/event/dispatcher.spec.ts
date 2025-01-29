import EnviaConsoleLogHandler from '../../@shared/event/handler/log'
import CustomerEventDispatcher from './dispatcher'
import CustomerCreated from './events/customer-created'

const mockEventName = 'CustomerCreated'

describe('CustomerEventDispatcher tests', () => {
	it('should register an event handler', () => {
		const eventDispatcher = new CustomerEventDispatcher()
		const eventHandler = new EnviaConsoleLogHandler()

		eventDispatcher.register(mockEventName, eventHandler)

		const handlers = eventDispatcher.getEventHandlers[mockEventName]
		expect(handlers[0]).toMatchObject(eventHandler)
		expect(handlers.length).toBe(1)
	})

	it('should unregister an event handler', () => {
		const eventDispatcher = new CustomerEventDispatcher()
		const eventHandler = new EnviaConsoleLogHandler()
		eventDispatcher.register(mockEventName, eventHandler)

		eventDispatcher.unregister(mockEventName, eventHandler)

		expect(eventDispatcher.getEventHandlers[mockEventName].length).toBe(0)
	})

	it('should unregister all event handlers', () => {
		const eventDispatcher = new CustomerEventDispatcher()
		const eventHandler = new EnviaConsoleLogHandler()
		eventDispatcher.register(mockEventName, eventHandler)

		eventDispatcher.unregisterAll()

		expect(eventDispatcher.getEventHandlers[mockEventName]).toBeUndefined()
	})

	it('should notify all event handlers', () => {
		const eventDispatcher = new CustomerEventDispatcher()
		const eventHandler = new EnviaConsoleLogHandler()
		const spyEventHandler = jest.spyOn(eventHandler, 'handle')
		eventDispatcher.register(mockEventName, eventHandler)

		eventDispatcher.notify(new CustomerCreated({ id: 'id', name: 'name' }))

		expect(spyEventHandler).toHaveBeenCalled()
	})
})
