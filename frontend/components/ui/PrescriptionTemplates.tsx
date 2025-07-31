'use client';

import { useState } from 'react';
import {
    Box,
    Chip,
    Typography,
    Paper,
    IconButton,
    Tooltip,
    Collapse,
} from '@mui/material';
import {
    Description,
    ExpandMore,
    ExpandLess,
    Add,
    LocalHospital,
} from '@mui/icons-material';

interface PrescriptionTemplate {
    id: string;
    name: string;
    category: string;
    content: string;
    description: string;
}

interface PrescriptionTemplatesProps {
    onTemplateSelect: (template: PrescriptionTemplate) => void;
}

const PRESCRIPTION_TEMPLATES: PrescriptionTemplate[] = [
    {
        id: 'analgesic',
        name: 'Analgésico',
        category: 'Dor',
        content: 'Dipirona 500mg - 1 comprimido a cada 6 horas por via oral\nParacetamol 750mg - 1 comprimido a cada 8 horas por via oral',
        description: 'Para alívio de dores leves a moderadas'
    },
    {
        id: 'antibiotic',
        name: 'Antibiótico',
        category: 'Infecção',
        content: 'Amoxicilina 500mg - 1 cápsula a cada 8 horas por via oral\nDuração: 7 dias\nTomar com estômago cheio',
        description: 'Para tratamento de infecções bacterianas'
    },
    {
        id: 'antiinflammatory',
        name: 'Anti-inflamatório',
        category: 'Inflamação',
        content: 'Ibuprofeno 600mg - 1 comprimido a cada 8 horas por via oral\nDuração: 5 dias\nTomar com alimentação',
        description: 'Para redução de inflamação e dor'
    },
    {
        id: 'antihistamine',
        name: 'Antialérgico',
        category: 'Alergia',
        content: 'Loratadina 10mg - 1 comprimido ao dia por via oral\nDuração: conforme necessidade',
        description: 'Para tratamento de alergias'
    },
    {
        id: 'vitamin',
        name: 'Vitamina',
        category: 'Suplemento',
        content: 'Vitamina C 500mg - 1 comprimido ao dia por via oral\nDuração: 30 dias',
        description: 'Para suplementação vitamínica'
    },
    {
        id: 'diuretic',
        name: 'Diurético',
        category: 'Pressão',
        content: 'Hidroclorotiazida 25mg - 1 comprimido ao dia pela manhã\nMonitorar pressão arterial',
        description: 'Para controle da pressão arterial'
    }
];

export default function PrescriptionTemplates({ onTemplateSelect }: PrescriptionTemplatesProps) {
    const [expanded, setExpanded] = useState(false);

    const handleTemplateSelect = (template: PrescriptionTemplate) => {
        onTemplateSelect(template);
    };

    const groupedTemplates = PRESCRIPTION_TEMPLATES.reduce((acc, template) => {
        if (!acc[template.category]) {
            acc[template.category] = [];
        }
        acc[template.category].push(template);
        return acc;
    }, {} as Record<string, PrescriptionTemplate[]>);

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.05)' },
                    borderRadius: 1,
                    p: 1,
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalHospital color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                        Templates Rápidos
                    </Typography>
                </Box>
                <IconButton size="small">
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                <Box sx={{ mt: 2 }}>
                    {Object.entries(groupedTemplates).map(([category, templates]) => (
                        <Box key={category} sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                                {category}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {templates.map((template) => (
                                    <Chip
                                        key={template.id}
                                        label={template.name}
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleTemplateSelect(template)}
                                        icon={<Add />}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Collapse>
        </Paper>
    );
} 