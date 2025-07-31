'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    IconButton,
    Tooltip,
    Divider,
    Typography
} from '@mui/material';
import {
    FormatBold,
    FormatItalic,
    FormatListBulleted,
    FormatListNumbered,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    ContentCopy,
    ContentPaste
} from '@mui/icons-material';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Digite aqui...",
    disabled = false,
    label
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleCopy = () => {
        if (editorRef.current) {
            const text = editorRef.current.innerText;
            navigator.clipboard.writeText(text);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            document.execCommand('insertText', false, text);
            if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
            }
        } catch (error) {
            console.error('Erro ao colar texto:', error);
        }
    };

    const toolbarButtons = [
        { icon: FormatBold, command: 'bold', tooltip: 'Negrito' },
        { icon: FormatItalic, command: 'italic', tooltip: 'Itálico' },
        { icon: FormatListBulleted, command: 'insertUnorderedList', tooltip: 'Lista com marcadores' },
        { icon: FormatListNumbered, command: 'insertOrderedList', tooltip: 'Lista numerada' },
        { icon: FormatAlignLeft, command: 'justifyLeft', tooltip: 'Alinhar à esquerda' },
        { icon: FormatAlignCenter, command: 'justifyCenter', tooltip: 'Centralizar' },
        { icon: FormatAlignRight, command: 'justifyRight', tooltip: 'Alinhar à direita' },
    ];

    return (
        <Box>
            {label && (
                <Typography variant="body2" color="text.secondary" mb={1}>
                    {label}
                </Typography>
            )}

            <Paper
                elevation={isFocused ? 2 : 1}
                sx={{
                    border: `2px solid ${isFocused ? 'primary.main' : 'divider'}`,
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        borderColor: 'primary.light',
                    }
                }}
            >
                {/* Toolbar */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        p: 1,
                        borderBottom: 1,
                        borderColor: 'divider',
                        backgroundColor: 'grey.50'
                    }}
                >
                    {toolbarButtons.map((button) => (
                        <Tooltip key={button.command} title={button.tooltip}>
                            <IconButton
                                size="small"
                                onClick={() => execCommand(button.command)}
                                disabled={disabled}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                        color: 'primary.contrastText'
                                    }
                                }}
                            >
                                <button.icon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ))}

                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                    <Tooltip title="Copiar texto">
                        <IconButton
                            size="small"
                            onClick={handleCopy}
                            disabled={disabled}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'success.light',
                                    color: 'success.contrastText'
                                }
                            }}
                        >
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Colar texto">
                        <IconButton
                            size="small"
                            onClick={handlePaste}
                            disabled={disabled}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'info.light',
                                    color: 'info.contrastText'
                                }
                            }}
                        >
                            <ContentPaste fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Editor */}
                <Box
                    ref={editorRef}
                    contentEditable={!disabled}
                    onInput={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    sx={{
                        minHeight: 200,
                        p: 2,
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        color: 'text.primary',
                        '&:empty:before': {
                            content: `"${placeholder}"`,
                            color: 'text.disabled',
                            fontStyle: 'italic'
                        },
                        '& ul, & ol': {
                            pl: 2,
                            mb: 1
                        },
                        '& li': {
                            mb: 0.5
                        },
                        '& p': {
                            mb: 1
                        },
                        '& strong': {
                            fontWeight: 'bold'
                        },
                        '& em': {
                            fontStyle: 'italic'
                        }
                    }}
                />
            </Paper>
        </Box>
    );
} 