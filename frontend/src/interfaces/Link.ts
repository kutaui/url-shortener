interface LinkPostType {
	link: string
	customCode?: string
}

interface Link {
	id: number
	longUrl: string
	code: string
	createdAt: string
	clickCount: number
	previewImage: string
}

interface MostClickedLinks {
	clickCount: number
	code: string
	id: number
	longUrl: string
}

interface GroupedByMonthLinks {
	month: string
	clickCount: number
}
