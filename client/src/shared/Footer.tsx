import { FC } from 'react';

import { Avatar, Box, Container, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export const Footer: FC = () => {
    const { t } = useTranslation();
    const SectionTitle: FC<{ label: string }> = ({ label }) => {
        return (
            <Text fontSize="sm" fontWeight="700" opacity="0.6" pb="2">
                {t(label)}
            </Text>
        );
    };

    const SectionLink: FC<{ label: string; route?: string; onClick?: () => void }> = ({ label, route, onClick }) => {
        return (
            <Link fontSize="sm" fontWeight="500" color="blue.500" as={NavLink} to={route || ''} onClick={onClick}>
                {t(label)}
            </Link>
        );
    };

    const Rights: FC<{ display: any; pt: string }> = ({ display, pt }) => {
        return (
            <Text display={display} fontSize="xs" pt={pt} color={useColorModeValue('gray.600', 'gray.200')}>
                © {new Date().getFullYear()} trackCTA. All rights reserved.
            </Text>
        );
    };

    return (
        <Box>
            <Container maxW="container.lg">
                <Flex
                    justifyContent="space-between"
                    py="8"
                    alignItems="start"
                    flexDirection={{ base: 'column', md: 'row' }}
                >
                    <Box>
                        <Flex alignItems="center">
                            <Avatar src="logo.svg" size="sm" />
                            <Text fontWeight="800" pl="2" fontSize="sm" opacity="0.9">
                                trackCTA
                            </Text>
                        </Flex>
                        <Rights pt="2" display={{ base: 'none', md: 'flex' }} />
                    </Box>
                    <Flex
                        mt={{ base: '6', md: '0' }}
                        spacing={{ base: '0', md: 16 }}
                        flexDirection={{ base: 'column', md: 'row' }}
                    >
                        <Flex direction="column" justifyContent="flex-start" textAlign="start">
                            <SectionTitle label="APPLICATION" />
                            <SectionLink label="FAQ" route="/faq" />
                            <SectionLink label="TERMS" route="/terms" />
                            <SectionLink label="POLICY" route="/policy" />
                        </Flex>
                        <Flex
                            direction="column"
                            justifyContent="flex-start"
                            textAlign="start"
                            ml={{ base: '0', md: '16' }}
                            mt={{ base: '4', md: '0' }}
                        >
                            <SectionTitle label="HELP" />
                            <SectionLink label="CONTACT" route="/contact" />
                            <SectionLink label="CONTRIBUTE" />
                        </Flex>
                    </Flex>
                    <Rights pt="6" display={{ base: 'flex', md: 'none' }} />
                </Flex>
            </Container>
        </Box>
    );
};
