import Address from '../../../domain/customer/value-object/address'
import CustomerEventDispatcherFixture from '../../../tests/fixtures/domain/customer/event/event-dispatcher'
import CustomerRepositoryFixture from '../../../tests/fixtures/infrastructure/customer/repository'
import CreateCustomerUseCase from './create'

describe('CreateCustomerUseCase test', () => {
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
		const mockRepository = new CustomerRepositoryFixture()
		const mockEventDispatcher = new CustomerEventDispatcherFixture()
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
		expect.assertions(2)
	})

	it("should dispatch a CustomerChangedAddress event when changing customer's address", async () => {
		const mockRepository = new CustomerRepositoryFixture()
		const mockEventDispatcher = new CustomerEventDispatcherFixture()
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
	})
})
