import EnviaConsoleLogHandler from '../../../domain/@shared/event/handler/log'
import EnviaConsoleLog1Handler from '../../../domain/@shared/event/handler/log-1'
import EnviaConsoleLog2Handler from '../../../domain/@shared/event/handler/log-2'
import Address from '../../../domain/customer/value-object/address'
import CustomerEventDispatcherFixture from '../../../tests/fixtures/domain/customer/event/event-dispatcher'
import CustomerRepositoryFixture from '../../../tests/fixtures/infrastructure/customer/repository'
import CreateCustomerUseCase from './create'

describe('CreateCustomerUseCase', () => {
	beforeEach(jest.clearAllMocks)

	it('should create a new customer', async () => {
		const mockRepository = new CustomerRepositoryFixture()
		const mockEventDispatcher = new CustomerEventDispatcherFixture()
		const usecase = new CreateCustomerUseCase(
			mockRepository,
			mockEventDispatcher
		)

		await usecase.execute({ name: 'name', active: false })

		expect(mockRepository.create).toHaveBeenLastCalledWith(
			expect.objectContaining({
				_id: expect.any(String),
				_name: 'name',
				_active: false,
			})
		)
	})

	it("should only create the user active if there's an address", async () => {
		const mockRepository = new CustomerRepositoryFixture()
		const mockEventDispatcher = new CustomerEventDispatcherFixture()
		const usecase = new CreateCustomerUseCase(
			mockRepository,
			mockEventDispatcher
		)
		const mockAddress = new Address('street', 1, 'zip', 'city')

		await usecase.execute({ name: 'name', active: true })

		expect(mockRepository.create).toHaveBeenLastCalledWith(
			expect.objectContaining({ _active: false })
		)

		await usecase.execute({
			name: 'name',
			active: true,
			address: mockAddress,
		})

		expect(mockRepository.create).toHaveBeenLastCalledWith(
			expect.objectContaining({ _active: true, _address: mockAddress })
		)
	})

	it('should dispatch a CustomerCreated event upon successful creation', async () => {
		const spyConsoleLog = jest.spyOn(console, 'log')
		const mockRepository = new CustomerRepositoryFixture()
		const mockEventDispatcher = new CustomerEventDispatcherFixture(
			jest.fn().mockImplementation(event => {
				if (event.constructor.name === 'CustomerCreated') {
					new EnviaConsoleLog1Handler().handle(event)
					new EnviaConsoleLog2Handler().handle(event)
				}
			})
		)
		const usecase = new CreateCustomerUseCase(
			mockRepository,
			mockEventDispatcher
		)
		mockRepository.create.mockRejectedValueOnce(undefined)

		await usecase.execute({ name: 'name', active: true }).catch(() => {
			expect(mockEventDispatcher.notify).not.toHaveBeenCalled()
		})

		await usecase.execute({ name: 'name', active: true })

		expect(mockEventDispatcher.notify).toHaveBeenLastCalledWith({
			dataTimeOccurred: expect.any(Date),
			eventData: { id: expect.any(String), name: 'name' },
		})
		expect(spyConsoleLog).toHaveBeenCalledWith(
			'Esse é o primeiro console.log do evento: CustomerCreated'
		)
		expect(spyConsoleLog).toHaveBeenLastCalledWith(
			'Esse é o segundo console.log do evento: CustomerCreated'
		)
		expect(spyConsoleLog).toHaveBeenCalledTimes(2)
		expect.assertions(5)
	})

	it("should dispatch a CustomerChangedAddress event when changing customer's address", async () => {
		const spyConsoleLog = jest.spyOn(console, 'log')
		const mockRepository = new CustomerRepositoryFixture()
		const mockEventDispatcher = new CustomerEventDispatcherFixture(
			jest.fn().mockImplementation(event => {
				if (event.constructor.name === 'CustomerChangedAddress') {
					new EnviaConsoleLogHandler().handle(event)
				}
			})
		)
		const usecase = new CreateCustomerUseCase(
			mockRepository,
			mockEventDispatcher
		)
		const mockAddress = new Address('street', 1, 'zip', 'city')
		const eventData = new RegExp(
			`Endereço do cliente: .*?, name alterado para: ${mockAddress.toString()}`
		)

		await usecase.execute({ name: 'name', active: true })

		expect(mockEventDispatcher.notify).not.toHaveBeenCalledWith({
			dataTimeOccurred: expect.any(Date),
			eventData: expect.stringMatching(eventData),
		})

		await usecase.execute({
			name: 'name',
			active: true,
			address: mockAddress,
		})

		expect(mockEventDispatcher.notify).toHaveBeenCalledWith({
			dataTimeOccurred: expect.any(Date),
			eventData: expect.stringMatching(eventData),
		})
		expect(spyConsoleLog).toHaveBeenLastCalledWith(
			expect.stringMatching(eventData)
		)
	})
})
