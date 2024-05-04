interface LinkPostType {
	link: string
	customCode?: string
}

interface Link {
	id: number
	link: string
	code: string
	userId?: number
	created_at: string
}
