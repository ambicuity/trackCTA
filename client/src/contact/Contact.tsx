import { ChangeEvent, FC, FormEvent, useState } from 'react';

import {
    Box,
    Button,
    Heading,
    InputGroup,
    InputLeftElement,
    Text,
    Input,
    Container,
    FormControl,
    FormLabel,
    Textarea,
    Flex,
    useToast,
    useColorModeValue,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { Footer } from 'shared/Footer';
import { MailIcon, MessageIcon } from 'utils/Icons';
import { sendMessage } from 'utils/Service';

interface Form {
    email: string;
    message: string;
}

interface FormError {
    email: boolean;
    message: boolean;
}

const initialForm: Form = { email: '', message: '' };
const initialFormError: FormError = { email: false, message: false };

export const Contact: FC = () => {
    const { t } = useTranslation();
    const [form, setForm] = useState<Form>(initialForm);
    const [error, setError] = useState<FormError>(initialFormError);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();
    const bg = useColorModeValue('gray.100', 'gray.700');
    const iconColor = useColorModeValue('gray.600', 'gray.300');

    const validateEmail = (email: string) => {
        const exp = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

        return exp.test(email);
    };

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prevForm: Form) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const currentError = { ...error };

        if (!validateEmail(form.email)) currentError.email = true;
        else currentError.email = false;

        if (!form.message.length) currentError.message = true;
        else currentError.message = false;

        setError(currentError);

        if (!currentError.email && !currentError.email) {
            try {
                setLoading(true);
                await sendMessage(form.email, form.message);

                setLoading(false);
                setForm(initialForm);
                setError(initialFormError);
                toast.closeAll();
                toast({ description: 'Message sent!', status: 'success' });
            } catch (err) {
                setLoading(false);
                toast.closeAll();
                toast({ description: 'Could not send. Please try again later', status: 'error' });
            }
        } else {
            console.log('show errors');
        }
    };

    return (
        <Box>
            <Container maxW="container.lg">
                <Box pt="8" pb="24">
                    <Heading fontWeight="bold">{t('CONTACT')}</Heading>
                    <form onSubmit={onSubmit}>
                        <FormControl mt="8" isInvalid={error.email}>
                            <FormLabel fontSize="sm">{t('EMAIL')}</FormLabel>
                            <InputGroup>
                                <InputLeftElement color={iconColor}>
                                    <MailIcon />
                                </InputLeftElement>
                                <Input
                                    border="0"
                                    bg={bg}
                                    value={form.email}
                                    onChange={onChange}
                                    name="email"
                                    placeholder={t('ENTER_EMAIL')}
                                />
                            </InputGroup>
                            {error.email && (
                                <Text color="red.500" pt="1" fontSize="xs">
                                    {t('EMAIL_ERROR')}
                                </Text>
                            )}
                        </FormControl>
                        <FormControl mt="4" isInvalid={error.message}>
                            <FormLabel fontSize="sm">{t('MESSAGE')}</FormLabel>
                            <InputGroup>
                                <InputLeftElement color={iconColor}>
                                    <MessageIcon />
                                </InputLeftElement>
                                <Textarea
                                    border="0"
                                    value={form.message}
                                    onChange={onChange}
                                    rows={5}
                                    bg={bg}
                                    name="message"
                                    placeholder={t('ENTER_MESSAGE')}
                                    pl="40px"
                                />
                            </InputGroup>
                            {error.message && (
                                <Text color="red.500" pt="1" fontSize="xs">
                                    {t('MESSAGE_ERROR')}
                                </Text>
                            )}
                        </FormControl>
                        <Flex justifyContent="flex-end" mt="6">
                            <Button colorScheme="blue" type="submit" isLoading={loading}>
                                {t('SEND')}
                            </Button>
                        </Flex>
                    </form>
                </Box>
                <Footer />
            </Container>
        </Box>
    );
};
