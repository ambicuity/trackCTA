import { FC } from 'react';

import { Avatar, Box, Button, Container, Flex, HStack, Link, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { Drawer } from 'drawer/Drawer';
import { ArrowRightIcon } from 'utils/Icons';
import { LocaleColorMode } from 'shared/LocaleColorMode';

export const Navbar: FC = () => {
    const { t } = useTranslation();
    const bg = useColorModeValue('white', 'gray.800');

    const onStart = () => {
        window.open('https://app.trackcta.com', '_blank');
    };

    return (
        <Flex position="fixed" p="4" top="0" bg={bg} w="100%" zIndex="10">
            <Container maxW="container.lg" px="0">
                <Flex justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center" spacing={8} display={{ base: 'none', md: 'flex' }}>
                        <Avatar src="/logo.svg" h="40px" w="40px" cursor="pointer" as={NavLink} to="/" />
                        <Link fontWeight="600" to="/faq" as={NavLink}>
                            {t('FAQ')}
                        </Link>
                        <Link fontWeight="600" to="/contact" as={NavLink}>
                            {t('CONTACT')}
                        </Link>
                    </HStack>

                    <Box display={{ base: 'block', md: 'none' }}>
                        <Drawer />
                    </Box>

                    <HStack spacing="4">
                        <LocaleColorMode display={{ base: 'none', md: 'flex' }} />
                        <Button colorScheme="blue" rightIcon={<ArrowRightIcon />} onClick={onStart}>
                            {t('START_TRACKING')}
                        </Button>
                    </HStack>
                </Flex>
            </Container>
        </Flex>
    );
};
