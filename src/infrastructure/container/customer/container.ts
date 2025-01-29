import EnviaConsoleLogHandler from '../../../domain/@shared/event/handler/log'
import EnviaConsoleLog1Handler from '../../../domain/@shared/event/handler/log-1'
import EnviaConsoleLog2Handler from '../../../domain/@shared/event/handler/log-2'
import CustomerEventDispatcher from '../../../domain/customer/event/dispatcher'
import CustomerRepository from '../../customer/repository/sequelize/customer.repository'

export default class CustomerContainer {
	static REPOSITORY = new CustomerRepository()
	static EVENT_DISPATCHER = new CustomerEventDispatcher()

	constructor() {
		CustomerContainer.EVENT_DISPATCHER.register(
			'CustomerCreated',
			new EnviaConsoleLog1Handler()
		)
		CustomerContainer.EVENT_DISPATCHER.register(
			'CustomerCreated',
			new EnviaConsoleLog2Handler()
		)
		CustomerContainer.EVENT_DISPATCHER.register(
			'CustomerChangedAddress',
			new EnviaConsoleLogHandler()
		)
	}
}
