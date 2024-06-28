import { FC } from 'react';

import { Avatar, Box, Container, Divider, SimpleGrid, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { IconType } from 'react-icons/lib';
import { ActivityIcon, LanguageIcon, PhoneIcon, UserHeartIcon } from 'utils/Icons';

interface FeatureItem {
    Icon: IconType;
    title: string;
    details: string;
}

const features: FeatureItem[] = [
    {
        Icon: ActivityIcon,
        title: 'LIVE_TRACKING',
        details: 'LIVE_TRACKING_DETAILS',
    },
    {
        Icon: LanguageIcon,
        title: 'LOCALE',
        details: 'LOCALE_DETAILS',
    },
    {
        Icon: UserHeartIcon,
        title: 'PERSONAL',
        details: 'PERSONAL_DETAILS',
    },
    {
        Icon: PhoneIcon,
        title: 'RESPONSIVE',
        details: 'RESPONSIVE_DETAILS',
    },
];

export const Features: FC = () => {
    const { t } = useTranslation();

    const Item: FC<FeatureItem> = ({ Icon, title, details }) => {
        return (
            <Box color="white" px="8">
                <Avatar color="blue.300" icon={<Icon fontSize="36px" />} bg="transparent" />
                <Text fontSize="2xl" fontWeight="700" pt="4">
                    {t(title)}
                </Text>
                <Text pt="1" fontWeight="500">
                    {t(details)}
                </Text>
            </Box>
        );
    };

    return (
        <>
            <Divider />
            <Box bg="blue.500" w="100%" py="24">
                <Container maxW="container.lg">
                    <Box textAlign="center">
                        <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="900" color="white">
                            {t('WHY')}
                        </Text>
                        <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            mt="16"
                            direction={{ base: 'column', md: 'row' }}
                            spacing={24}
                        >
                            {features.map((feature) => (
                                <Item {...feature} key={feature.title} />
                            ))}
                        </SimpleGrid>
                    </Box>
                </Container>
            </Box>
        </>
    );
};
