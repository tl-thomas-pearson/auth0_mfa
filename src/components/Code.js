import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {  materialOceanic as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Code = ({ children, ...props }) => (
    <SyntaxHighlighter language="json" style={theme} customStyle={{ minHeight: 500 }} showLineNumbers wrapLongLines {...props}>
        {children || JSON.stringify({ greetings: '👋' }) }
    </SyntaxHighlighter>
);

export default Code;