import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const GetLinksByUserRequest = (): Promise<Link[]> => axios.get(`/links`).then(response => response.data)

export const GetLinksByUserQuery = () =>
	useQuery({
		queryKey: ['linksByUser'],
		queryFn: () => GetLinksByUserRequest(),
	})

export const GetLinkByIdRequest = (id: string): Promise<Link> => axios.get(`/account/login`).then(response => response.data)

export const GetLinkByIdQuery = (id: string) =>
	useQuery({
		queryKey: ['linksById'],
		queryFn: () => GetLinkByIdRequest(id),
	})

export const DeleteLink = (id: number) => axios.delete(`/link/delete?id=${id}`)

export const CreateLinkRequest = (form: LinkPostType) =>
	axios.post(`/link/create`, form)
