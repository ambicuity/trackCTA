import { FunctionComponent } from 'react';

import {
    Box,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Container,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { Footer } from 'shared/Footer';

const faqData = [1, 2, 3, 4, 5, 6, 7, 8];

export const FAQ: FunctionComponent = () => {
    const { t } = useTranslation('faq');

    return (
        <Box>
            <Container maxW="container.lg">
                <Box pt="8" pb="24">
                    <Heading fontWeight="bold">{t('FAQ_FULL', { ns: 'client' })}</Heading>
                    <Accordion mt="8" allowMultiple>
                        {faqData.map((data) => (
                            <AccordionItem key={data}>
                                <AccordionButton py="5">
                                    <Box flex="1" textAlign="left" fontWeight="600" fontSize="lg">
                                        {t(`Q${data}`)}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>{t(`A${data}`)}</AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Box>
                <Footer />
            </Container>
        </Box>
    );
};
