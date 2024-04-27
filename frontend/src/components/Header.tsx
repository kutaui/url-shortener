'use client'

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/button'

export default function Header() {
	const [isOpen, setIsOpen] = useState(false)

	const pathname = usePathname()

	function isRouteActive(route: string) {
		return pathname === route
	}

	return (
		<>
			<section
				className="hidden justify-between items-center w-[80%] mx-auto md:flex "
				aria-label="Navigation Container"
			>
				<Image
					src="/logo-no-background.svg"
					alt="Logo"
					width={130}
					height={130}
				/>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<Link href="/" passHref>
								<NavigationMenuLink
									className={cn(
										navigationMenuTriggerStyle(),
										isRouteActive('/') ? 'font-bold text-primary bg-accent' : ''
									)}
								>
									Home
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/pricing" passHref>
								<NavigationMenuLink
									className={cn(
										navigationMenuTriggerStyle(),
										isRouteActive('/pricing')
											? 'font-bold text-primary bg-accent'
											: ''
									)}
								>
									Pricing
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/docs" passHref>
								<NavigationMenuLink
									className={cn(
										navigationMenuTriggerStyle(),
										isRouteActive('/docs')
											? 'font-bold text-primary bg-accent'
											: ''
									)}
								>
									Documentation
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
				<div className="flex justify-between gap-2">
					<Link href="/login" passHref>
						<Button variant="outline" className="border-primary">
							Login
						</Button>
					</Link>
					<Link href="/register" passHref>
						<Button>Register</Button>
					</Link>
				</div>
			</section>
			{/* MOBILE NAVIGATION */}
		</>
	)
}
