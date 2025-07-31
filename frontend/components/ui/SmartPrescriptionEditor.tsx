'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Tooltip,
    Paper,
    Typography,
    Chip,
    Divider,
    Alert,
} from '@mui/material';
import {
    FormatBold,
    FormatItalic,
    FormatListBulleted,
    FormatListNumbered,
    Undo,
    Redo,
    ContentCopy,
    Save,
    Clear,
    Keyboard,
} from '@mui/icons-material';

interface SmartPrescriptionEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    rows?: number;
}

export default function SmartPrescriptionEditor({
    value,
    onChange,
    placeholder = "Digite a prescrição médica...",
    label = "Prescrição",
    rows = 8,
}: SmartPrescriptionEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Atalhos de teclado para formatação
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isFocused) return;

            // Ctrl+B para negrito
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                document.execCommand('bold', false);
            }
            // Ctrl+I para itálico
            else if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                document.execCommand('italic', false);
            }
            // Ctrl+Z para desfazer
            else if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                document.execCommand('undo', false);
            }
            // Ctrl+Y para refazer
            else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                document.execCommand('redo', false);
            }
            // Tab para lista
            else if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand('insertUnorderedList', false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFocused]);

    const formatText = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const insertText = (text: string) => {
        if (editorRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
                onChange(editorRef.current.innerHTML);
            }
        }
    };

    const insertTemplate = (template: string) => {
        if (editorRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const templateNode = document.createElement('div');
                templateNode.innerHTML = template;
                range.deleteContents();
                range.insertNode(templateNode);
                onChange(editorRef.current.innerHTML);
            }
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value);
            // Mostrar feedback visual
        } catch (error) {
            console.error('Erro ao copiar:', error);
        }
    };

    const clearContent = () => {
        if (editorRef.current) {
            editorRef.current.innerHTML = '';
            onChange('');
        }
    };

    const shortcuts = [
        { key: 'Ctrl+B', description: 'Negrito' },
        { key: 'Ctrl+I', description: 'Itálico' },
        { key: 'Tab', description: 'Lista' },
        { key: 'Ctrl+Z', description: 'Desfazer' },
        { key: 'Ctrl+Y', description: 'Refazer' },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                    {label}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Atalhos de teclado">
                        <IconButton
                            size="small"
                            onClick={() => setShowShortcuts(!showShortcuts)}
                            color={showShortcuts ? 'primary' : 'default'}
                        >
                            <Keyboard />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Copiar prescrição">
                        <IconButton size="small" onClick={copyToClipboard}>
                            <ContentCopy />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Limpar">
                        <IconButton size="small" onClick={clearContent}>
                            <Clear />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {showShortcuts && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="caption" fontWeight={600}>Atalhos disponíveis:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {shortcuts.map((shortcut) => (
                            <Chip
                                key={shortcut.key}
                                label={`${shortcut.key}: ${shortcut.description}`}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Alert>
            )}

            <Paper elevation={isFocused ? 4 : 1} sx={{ transition: 'all 0.2s ease' }}>
                <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Negrito (Ctrl+B)">
                            <IconButton size="small" onClick={() => formatText('bold')}>
                                <FormatBold />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Itálico (Ctrl+I)">
                            <IconButton size="small" onClick={() => formatText('italic')}>
                                <FormatItalic />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem />
                        <Tooltip title="Lista com marcadores">
                            <IconButton size="small" onClick={() => formatText('insertUnorderedList')}>
                                <FormatListBulleted />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Lista numerada">
                            <IconButton size="small" onClick={() => formatText('insertOrderedList')}>
                                <FormatListNumbered />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem />
                        <Tooltip title="Desfazer (Ctrl+Z)">
                            <IconButton size="small" onClick={() => formatText('undo')}>
                                <Undo />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Refazer (Ctrl+Y)">
                            <IconButton size="small" onClick={() => formatText('redo')}>
                                <Redo />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Box
                    ref={editorRef}
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: value }}
                    onInput={(e) => onChange(e.currentTarget.innerHTML)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    sx={{
                        minHeight: `${rows * 24}px`,
                        p: 2,
                        outline: 'none',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        '&:empty:before': {
                            content: `"${placeholder}"`,
                            color: 'text.disabled',
                            fontStyle: 'italic',
                        },
                        '&:focus': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                        '& ul, & ol': {
                            marginLeft: 2,
                        },
                        '& li': {
                            marginBottom: 0.5,
                        },
                    }}
                />
            </Paper>
        </Box>
    );
} 