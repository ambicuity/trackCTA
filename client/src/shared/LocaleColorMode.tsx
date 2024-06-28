import { FC } from 'react';

import { HStack, IconButton, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from 'utils/Icons';

interface Props {
    display?: any;
}

export const LocaleColorMode: FC<Props> = ({ display }) => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <HStack display={display}>
            {/* <IconButton fontSize="xl" aria-label="locale" icon={<LanguageIcon />} variant="ghost" /> */}
            <IconButton
                fontSize="xl"
                aria-label="appearance"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                variant="ghost"
                onClick={toggleColorMode}
            />
        </HStack>
    );
};
