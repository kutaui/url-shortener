import axios from "axios"
import { useQuery } from "@tanstack/react-query"

export const GetClicksGroupedByMonth = () => axios.get(`/analytics/clickedByMonth`).then(response => response.data)

export const GetClicksGroupedByMonthQuery = () =>
    useQuery({
        queryKey: ['clicksGroupedByMonth'],
        queryFn: () => GetClicksGroupedByMonth(),
    })


export const GetMostClickedUrls = (): Promise<MostClicked[]> => axios.get(`/analytics/mostClicked`).then(response => response.data)

export const GetMostClickedUrlsQuery = () =>
    useQuery({
        queryKey: ['mostClickedUrls'],
        queryFn: () => GetMostClickedUrls(),
    })

export const GetTotalClicks = () => axios.get(`/analytics/totalClicks`).then(response => response.data)

export const GetTotalClicksQuery = () =>
    useQuery({
        queryKey: ['totalClicks'],
        queryFn: () => GetTotalClicks(),
    })


