'use client'
import React, { useContext } from 'react'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from './ui/resizable'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button, buttonVariants } from './ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip'
import {
	Archive,
	ArchiveX,
	Inbox,
	LucideIcon,
	Send,
	Users,
	File,
	LayoutDashboard,
	Link as LinkIcon,
	Settings,
	ChartColumnBig,
	Mail,
	Megaphone,
	LogOut,
} from 'lucide-react'
import { Separator } from './ui/separator'
import { AuthContext } from './Providers'
import { usePathname } from 'next/navigation'
import { useToast } from './ui/use-toast'
import { useSSE } from '@/controllers/SSEhandler'
import { ReactNode } from 'react'
import { BASE_URL } from './Providers'

interface NavProps {
	isCollapsed: boolean
	links: {
		title: string
		label?: string
		icon: LucideIcon
		variant: 'default' | 'ghost'
		href: string
	}[]
}

export function Nav({ links, isCollapsed }: NavProps) {
	const { toast } = useToast()
	useSSE(`${BASE_URL}/api/link-clicked-events`, (data) => {
		if (data.connected) {
			console.log('Connected to SSE stream')
		} else {
			console.log('Link clicked:', data)
			toast({
				title: 'Link Clicked',
				description: ` Your link with the code: ${data.code} has been clicked.`,
				variant: 'success',
			})
		}
	})
	return (
		<div
			data-collapsed={isCollapsed}
			className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
		>
			<nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				{links.map((link, index) =>
					isCollapsed ? (
						<Tooltip key={index} delayDuration={0}>
							<TooltipTrigger asChild>
								<Link
									href={link.href}
									className={cn(
										buttonVariants({ variant: link.variant, size: 'icon' }),
										'h-9 w-9',
										link.variant === 'default' &&
											'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
									)}
								>
									<link.icon className="h-4 w-4" />
									<span className="sr-only">{link.title}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right" className="flex items-center gap-4">
								{link.title}
								{link.label && (
									<span className="ml-auto text-muted-foreground">
										{link.label}
									</span>
								)}
							</TooltipContent>
						</Tooltip>
					) : (
						<Link
							key={index}
							href={link.href}
							className={cn(
								buttonVariants({ variant: link.variant, size: 'sm' }),
								link.variant === 'default' &&
									'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
								'justify-start'
							)}
						>
							<link.icon className="mr-2 h-4 w-4" />
							{link.title}
							{link.label && (
								<span
									className={cn(
										'ml-auto',
										link.variant === 'default' &&
											'text-background dark:text-white'
									)}
								>
									{link.label}
								</span>
							)}
						</Link>
					)
				)}
			</nav>
		</div>
	)
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const { user } = useContext(AuthContext)

	const [isCollapsed, setIsCollapsed] = React.useState(false)
	const pathname = usePathname()

	return (
		<aside>
			<TooltipProvider delayDuration={0}>
				<ResizablePanelGroup
					direction="horizontal"
					className="h-screen items-stretch"
				>
					<ResizablePanel
						defaultSize={20}
						collapsedSize={2}
						collapsible={true}
						minSize={12}
						maxSize={15}
						onCollapse={() => {
							setIsCollapsed(true)
						}}
						onResize={() => {
							setIsCollapsed(false)
						}}
						className={cn(
							'h-screen',
							isCollapsed &&
								'min-w-[50px] transition-all duration-300 ease-in-out'
						)}
					>
						<div
							className={cn(
								'flex h-[52px] items-center justify-center m-1',
								isCollapsed ? 'h-[52px]' : 'px-2'
							)}
						>
							{!isCollapsed && `Welcome, ${user?.name}`}
						</div>
						<Separator />
						<Nav
							isCollapsed={isCollapsed}
							links={[
								{
									title: 'Dashboard',
									icon: LayoutDashboard,
									variant: pathname === '/dashboard' ? 'default' : 'ghost',
									href: '/dashboard',
								},
								{
									title: 'My Links',
									icon: LinkIcon,
									variant:
										pathname === '/dashboard/mylinks' ? 'default' : 'ghost',
									href: '/dashboard/mylinks',
								},
								{
									title: 'Campaigns',
									label: '',
									icon: Megaphone,
									variant:
										pathname === '/dashboard/campaigns' ? 'default' : 'ghost',
									href: '#',
								},
								{
									title: 'Team',
									icon: Users,
									variant: 'ghost',
									href: '#',
								},
								{
									title: 'Messages',
									icon: Mail,
									variant: 'ghost',
									href: '#',
								},
								{
									title: 'Analytics',
									icon: ChartColumnBig,
									variant: 'ghost',
									href: '#',
								},
								{
									title: 'More Stuff',
									icon: ArchiveX,
									variant: 'ghost',
									href: '#',
								},
								{
									title: 'Settings',
									label: '',
									icon: Settings,
									variant:
										pathname === '/dashboard/settings' ? 'default' : 'ghost',
									href: '#',
								},
								{
									title: 'Logout',
									label: '',
									icon: LogOut,
									variant:
										pathname === '/dashboard/settings' ? 'default' : 'ghost',
									href: '/logout',
								},
							]}
						/>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={30} minSize={30}>
						{children}
					</ResizablePanel>
					<ResizableHandle withHandle />
				</ResizablePanelGroup>
			</TooltipProvider>
		</aside>
	)
}
