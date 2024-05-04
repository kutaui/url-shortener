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
import { useContext, useState } from 'react'
import { AuthContext } from './Providers'
import { Button } from './ui/button'

export default function Header() {
	const [isOpen, setIsOpen] = useState(false)
	const { user } = useContext(AuthContext)

	const pathname = usePathname()

	function isRouteActive(route: string) {
		return pathname === route
	}

	return (
		<>
			<section
				className="hidden justify-between items-center w-[80%] mx-auto md:flex pb-6 "
				aria-label="Navigation Container"
			>
				<Image
					src="/logo-no-background.svg"
					alt="Logo with an icon of link chain and text 'Shortie'"
					width={130}
					height={130}
				/>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<Link href="/" legacyBehavior passHref>
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
							<Link href="/pricing" legacyBehavior passHref>
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
							<Link href="/docs" legacyBehavior passHref>
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
					{!user ? (
						<>
							<Link href="/login" passHref>
								<Button variant="outline" className="border-primary">
									Login
								</Button>
							</Link>
							<Link href="/register" passHref>
								<Button>Register</Button>
							</Link>
						</>
					) : (
						<Link href="/dashboard" passHref>
							<Button variant="outline" className="border-primary">
								Dashboard
							</Button>
						</Link>
					)}
				</div>
			</section>
			{/* MOBILE NAVIGATION */}
			<hr />
		</>
	)
}
