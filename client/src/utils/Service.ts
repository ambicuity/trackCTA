import axios from 'axios';

export const Http = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/v1/api`,
});

interface LocaleResponse {
    data: string;
    status: number;
}

export const getLocaleJson = async (url: string): Promise<LocaleResponse> => {
    const { data, status } = await Http.get(url);

    return { data, status };
};

export const sendMessage = async (email: string, message: string): Promise<string> => {
    const { data } = await Http.post('/contact', { email, message });

    return data;
};
