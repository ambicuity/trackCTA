import { FC, useRef, useState, useEffect } from 'react';

import { Box, Container, Flex, IconButton, Image, Text, useColorMode, useColorModeValue, Fade } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Slider, { Settings } from 'react-slick';

import { LeftIcon, RightIcon } from 'utils/Icons';

import 'home/Steps.scss';

interface Step {
    fileName: string;
    title: string;
}

const steps: Step[] = [
    {
        fileName: '1',
        title: 'VISIT_THE_APP',
    },
    {
        fileName: '2',
        title: 'SELECT_ROUTE',
    },
    {
        fileName: '3',
        title: 'TRACK_BUSSES',
    },
    {
        fileName: '4',
        title: 'CHECK_STOPS',
    },
];

export const Steps: FC = () => {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const [current, setCurrent] = useState<Step>(steps[0]);
    const [fade, setFade] = useState<boolean>(true);
    const slider = useRef<Slider | null>(null);
    const bg = useColorModeValue('gray.50', 'gray.900');
    const images = steps.map((step) => `steps/${colorMode}/${step.fileName}.png`);
    const dotsClass = colorMode === 'light' ? 'light-dots' : 'dark-dots';

    const settings: Settings = {
        dots: true,
        arrows: false,
        fade: true,
        infinite: true,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (_, nextSlide) => {
            setFade(false);
            setTimeout(() => {
                setFade(true);
                setCurrent(steps[nextSlide]);
            }, 300);
        },
    };

    useEffect(() => {
        setFade(true);
    }, []);

    useEffect(() => {
        setFade(true);

        if (slider) {
            slider.current?.slickGoTo(0);
            setCurrent(steps[0]);
        }
    }, [colorMode]);

    return (
        <Box bg={bg} w="100%" py="24" className="trackcta-steps">
            <Container maxW="container.lg" px={{ base: '4', md: '0' }}>
                <Box textAlign="center">
                    <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="900">
                        {t('HOW_IT_WORKS')}
                    </Text>
                </Box>

                <Box mt="20">
                    <Flex alignItems="center" justifyContent="space-between" transition="all 0.25s ease-in-out">
                        <IconButton
                            fontSize="xl"
                            variant="ghost"
                            aria-label="prev"
                            icon={<LeftIcon />}
                            onClick={() => slider.current?.slickPrev()}
                        />
                        <Fade in={fade} transition={{ exit: { duration: 0.1, opacity: 1 }, enter: { duration: 0.2 } }}>
                            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="700" lineHeight="1">
                                {t(current.title)}
                            </Text>
                        </Fade>
                        <IconButton
                            fontSize="xl"
                            variant="ghost"
                            aria-label="prev"
                            icon={<RightIcon />}
                            onClick={() => slider.current?.slickNext()}
                        />
                    </Flex>
                    <Slider {...settings} ref={slider} dotsClass={`slick-dots ${dotsClass}`}>
                        {images.map((url) => (
                            <Box key={url} borderRadius="xl" p="2" mt="2">
                                <Image boxShadow="lg" bg="transparent" w="100%" src={url} borderRadius="xl" />
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Container>
        </Box>
    );
};
