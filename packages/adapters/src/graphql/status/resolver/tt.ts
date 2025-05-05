import { Inject, Service } from 'typedi'

@Service()
export class RecipeService {
	@Inject('SAMPLE_RECIPES')
	private readonly items!: [{ id: string }]

	async getAll() {
		return this.items
	}

	async getOne(id: string) {
		return this.items.find((item) => item.id === id)
	}
}
