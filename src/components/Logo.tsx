import React from 'react';
import { Image, ImageStyle } from 'react-native';
import logo from '../assets/images/logo.png';
const Logo = ({ width = 140, style }: { width?: number, style?: ImageStyle }) => {
    return (
        <Image source={logo} style={[style, { width: width, height: width / 1.85 }]} />
    );
};

export default Logo;
