import { FC, lazy, useEffect } from 'react';

import { Box } from '@chakra-ui/react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Navbar } from 'navbar/Navbar';

const Contact = lazy(() => import('contact/Contact').then((module) => ({ default: module.Contact })));
const Home = lazy(() => import('home/Home').then((module) => ({ default: module.Home })));
const FAQ = lazy(() => import('faq/FAQ').then((module) => ({ default: module.FAQ })));

export const Content: FC = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [location]);

    return (
        <>
            <Box pt="80px" h="100%" w="100%">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/faq" element={<FAQ />}></Route>
                    <Route path="/contact" element={<Contact />}></Route>
                </Routes>
            </Box>
        </>
    );
};
