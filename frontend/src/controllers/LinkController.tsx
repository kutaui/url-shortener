import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const GetLinksByUserRequest = () => axios.get(`/account/login`)

export const GetLinksByUserQuery = () =>
	useQuery({
		queryKey: ['linksByUser'],
		queryFn: () => GetLinksByUserRequest(),
	})

export const GetLinkByIdRequest = (id: string) => axios.get(`/account/login`)

export const GetLinkByIdQuery = (id: string) =>
	useQuery({
		queryKey: ['linksById'],
		queryFn: () => GetLinkByIdRequest(id),
	})

export const DeleteLink = (id: string) => axios.delete(`/account/login`)

export const CreateLink = (form: LinkPostType) =>
	axios.post(`/account/login`, form)
