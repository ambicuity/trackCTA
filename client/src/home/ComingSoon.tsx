import { FC } from 'react';

import { Box, Container, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const ComingSoon: FC = () => {
    const { t } = useTranslation();
    const bg = useColorModeValue('gray.50', 'gray.700');

    return (
        <Box bg={bg} py="24" textAlign="center">
            <Container maxW="container.lg">
                <Text fontWeight="900" fontSize={{ base: '3xl', md: '4xl' }}>
                    {t('COMING_SOON')}
                </Text>
            </Container>
        </Box>
    );
};
