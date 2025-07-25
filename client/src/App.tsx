import { FC, Suspense, useState } from 'react';

import { Center, Spinner } from '@chakra-ui/react';
import { LocaleProvider } from 'locale/LocaleProvider';
import { Content } from 'utils/Content';

import './App.scss';
import { BrowserRouter } from 'react-router-dom';

export const App: FC = () => {
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <div className="App">
            <LocaleProvider setSystemLoading={setLoading} />
            
            {loading ? (
                <Center h="100%" w="100%">
                    <Spinner color="blue.400" size="lg" role="status" />
                </Center>
            ) : (
                <Suspense fallback={null}>
                    <BrowserRouter>
                        <Content />
                    </BrowserRouter>
                </Suspense>
            )}
        </div>
    );
};
