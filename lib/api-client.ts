import { IVideo } from "@/models/Video"

export type VideoFormData=Omit<IVideo,'_id'>

type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
}

class ApiClient{
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = 'GET', body, headers } = options;
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };
        
        try {
            const response = await fetch(`/api${endpoint}`, {
                method,
                body: body ? JSON.stringify(body) : undefined,
                headers: defaultHeaders
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error ${response.status}:`, errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Client Error:', error);
            throw error;
        }
    }

    async getVideos(){
        return this.fetch<IVideo[]>('/videos')
    }

    async getVideoById(id:string){
        return this.fetch<IVideo>(`/videos/${id}`)
    }
    
    async createVideo(videoData:VideoFormData){
        return this.fetch<IVideo>('/videos',{
            method:'POST',
            body:videoData
        })
    }
}

export const apiClient=new ApiClient()