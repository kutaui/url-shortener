interface LinkPostType {
  link: string;
  customCode?: string;
}

interface Link {
  id: number;
  link: string;
  code: string;
  userId?: number;
  created_at: string;
}

interface MostClickedLinks {
  clickCount: number;
  code: string;
  id: number;
  longUrl: string;
}

interface GroupedByMonthLinks {
  month: string;
  clickCount: number;
}
