import EventDispatcherInterface from '../../../../../domain/@shared/event/event-dispatcher.interface'

export default class CustomerEventDispatcherFixture
	implements EventDispatcherInterface
{
	constructor(
		public notify = jest.fn(),
		public register = jest.fn(),
		public unregister = jest.fn(),
		public unregisterAll = jest.fn()
	) {}
}
