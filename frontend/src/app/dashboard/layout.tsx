import DashboardLayout from '@/components/DashboardLayout'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<section className="flex  ">
			<DashboardLayout>{children}</DashboardLayout>
		</section>
	)
}
