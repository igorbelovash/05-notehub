import axios from 'axios';
import type { Note, CreateNote } from '../types/note';

interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

const NOTEHUB_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;

const noteApi = axios.create({
    baseURL: 'https://notehub-public.goit.study/api', // Здесь был потерян слэш и эндпоинт
    headers: {
        Authorization: `Bearer ${NOTEHUB_KEY}`,
        'Content-Type': 'application/json',
    }
});

export const fetchNotes = async(search: string | undefined, page: number, perPage = 12): Promise<FetchNotesResponse> => {
    const response = await noteApi.get<FetchNotesResponse>(`/notes`, {
        params: {
            search,
            page,
            perPage,
        }
    });
    return response.data;
};

export const createNote = async (note: CreateNote): Promise<Note> => {
    const { data } = await noteApi.post<Note>(`/notes`, note);
    return data;
}

export const deleteNote = async (id: string): Promise<Note> => {
    const { data } = await noteApi.delete<Note>(`/notes/${id}`);
    return data;
}
