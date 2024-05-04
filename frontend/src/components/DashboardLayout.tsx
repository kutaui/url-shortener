'use client'
import React, { useContext, useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import Image from 'next/image'
import { AuthContext } from '@/components/Providers'
import { LuLayoutDashboard } from 'react-icons/lu'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'
import { BsLink } from 'react-icons/bs'
import { CiFolderOn, CiSettings } from 'react-icons/ci'

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const { sidebarCollapsed, setSidebarCollapsed, user } =
		useContext(AuthContext)

	return (
		<section className="flex ">
			<div
				onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
				className={`absolute top-14 z-10 ${
					sidebarCollapsed ? 'left-[3.9rem]' : ' left-[14.9rem]'
				}`}
			>
				{!sidebarCollapsed ? (
					<IoIosArrowDropleft size={24} />
				) : (
					<IoIosArrowDropright size={24} />
				)}
			</div>
			<Sidebar
				collapsed={sidebarCollapsed}
				collapsedWidth="75px"
				className="h-screen"
			>
				<div className={` ${sidebarCollapsed ? 'p-4' : 'p-8'}`}>
					<Image
						src={sidebarCollapsed ? '/logo.png' : '/logo-no-background.svg'}
						alt="Logo with an icon of link chain and text 'Shortie'"
						width={sidebarCollapsed ? 600 : 130}
						height={sidebarCollapsed ? 600 : 130}
					/>
				</div>
				<Menu>
					<MenuItem icon={<LuLayoutDashboard size={24} />}>Dashboard</MenuItem>
					<MenuItem icon={<BsLink size={24} />}> Links </MenuItem>
					<MenuItem icon={<CiFolderOn size={24} />}> Campaings </MenuItem>
					<MenuItem icon={<CiFolderOn />}> Certified Banger </MenuItem>
					<MenuItem icon={<CiSettings size={24} />}> Settings </MenuItem>
				</Menu>
			</Sidebar>
			<div className="flex flex-col w-screen">
				<section className="h-[4.3rem] w-full border-b-2 ">
					<div className="flex items-center p-4 h-full">
						<h1 className="text-2xl font-semibold">
							Welcome back, <span className='text-primary'> {user?.name}</span>!
						</h1>
					</div>
				</section>
				<main className="p-12">{children}</main>
			</div>
		</section>
	)
}
