import { StrictMode } from 'react';

import { ChakraProvider, extendTheme, ThemeConfig, theme as ChakraTheme, ColorModeScript } from '@chakra-ui/react';
import ReactDOM from 'react-dom';

import { App } from './App';
import reportWebVitals from './reportWebVitals';

import './index.scss';

const theme = extendTheme({
    config: {
        cssVarPrefix: 'trackcta-client',
    } as ThemeConfig,
    shadows: {
        ...ChakraTheme.shadows,
        outline: 'none',
    },
});

ReactDOM.render(
    <StrictMode>
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
        </ChakraProvider>
    </StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
