import React, { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Chip,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useCids } from '@/hooks';
import { Cid } from '@/lib/types';

interface CidSelectProps {
    value: number | null;
    onChange: (cidId: number | null) => void;
    label?: string;
    required?: boolean;
    disabled?: boolean;
}

export default function CidSelect({
    value,
    onChange,
    label = "CID",
    required = false,
    disabled = false
}: CidSelectProps) {
    const { cids, isLoading } = useCids();
    const [selectedCid, setSelectedCid] = useState<Cid | null>(null);

    const handleChange = (event: any) => {
        const cidId = event.target.value;
        const cid = cids?.find(c => c.id === cidId) || null;
        setSelectedCid(cid);
        onChange(cidId);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    return (
        <FormControl fullWidth required={required} disabled={disabled}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value || ''}
                onChange={handleChange}
                label={label}
                renderValue={(selected) => {
                    const cid = cids?.find(c => c.id === selected);
                    return cid ? (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                                label={cid.code}
                                size="small"
                                sx={{
                                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                    color: '#FFFFFF',
                                    border: '1px solid rgba(59, 130, 246, 0.9)',
                                    fontWeight: 600,
                                }}
                            />
                            <Typography variant="body2" sx={{ color: '#F1F5F9' }}>
                                {cid.name}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                            Selecione um CID
                        </Typography>
                    );
                }}
            >
                {cids?.map((cid) => (
                    <MenuItem key={cid.id} value={cid.id}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Chip
                                label={cid.code}
                                size="small"
                                sx={{
                                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                    color: '#FFFFFF',
                                    border: '1px solid rgba(59, 130, 246, 0.9)',
                                    fontWeight: 600,
                                }}
                            />
                            <Box>
                                <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                                    {cid.name}
                                </Typography>
                                {cid.category && (
                                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                        {cid.category}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
} 