import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Close,
  Category,
  Description,
  MedicalServices,
  Code,
  Assignment,
} from "@mui/icons-material";
import { Cid } from "@/types/entities.types";

interface CidDetailsProps {
  open: boolean;
  onClose: () => void;
  cid: Cid;
  onUpdate?: () => void;
}

export default function CidDetails({
  open,
  onClose,
  cid,
  onUpdate,
}: CidDetailsProps) {
  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "12px 12px 0 0",
          p: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Assignment sx={{ color: "white", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
            Detalhes do CID
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                borderRadius: 2,
                border: "1px solid rgba(59, 130, 246, 0.2)",
                mt: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#F1F5F9", fontWeight: 600 }}
              >
                Informações Básicas
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Code sx={{ color: "#3B82F6" }} />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#94A3B8", fontWeight: 500 }}
                      >
                        Código CID
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "#F1F5F9", fontWeight: 600 }}
                      >
                        {cid.code}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Category sx={{ color: "#10B981" }} />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#94A3B8", fontWeight: 500 }}
                      >
                        Categoria
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "#F1F5F9", fontWeight: 600 }}
                      >
                        {cid.category || "Não informada"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
                    <Description sx={{ color: "#06B6D4", mt: 0.2 }} />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#94A3B8", fontWeight: 500, mb: 1 }}
                      >
                        Nome da Doença/Condição
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ color: "#F1F5F9", fontWeight: 600 }}
                      >
                        {cid.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {cid.description && (
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      <Description sx={{ color: "#06B6D4", mt: 0.2 }} />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "#94A3B8", fontWeight: 500, mb: 1 }}
                        >
                          Descrição
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#E2E8F0", lineHeight: 1.6 }}
                        >
                          {cid.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {cid.medicines && cid.medicines.length > 0 && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  background:
                    "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                  borderRadius: 2,
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "#F1F5F9", fontWeight: 600 }}
                >
                  Medicamentos Associados ({cid.medicines.length})
                </Typography>

                <Grid container spacing={2}>
                  {cid.medicines.map((medicine) => (
                    <Grid item xs={12} sm={6} md={4} key={medicine.id}>
                      <Box
                        sx={{
                          p: 2,
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          borderRadius: 2,
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <MedicalServices sx={{ color: "#10B981" }} />
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "#F1F5F9", fontWeight: 600 }}
                          >
                            {medicine.name}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{ color: "#94A3B8", mb: 1 }}
                        >
                          {medicine.description}
                        </Typography>

                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          Dosagem: {medicine.dosage}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                borderRadius: 2,
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#F1F5F9", fontWeight: 600 }}
              >
                Informações do Sistema
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#94A3B8", fontWeight: 500 }}
                  >
                    Data de Criação
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#E2E8F0" }}>
                    {new Date(cid.createdAt).toLocaleDateString("pt-BR")}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#94A3B8", fontWeight: 500 }}
                  >
                    Última Atualização
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#E2E8F0" }}>
                    {new Date(cid.updatedAt).toLocaleDateString("pt-BR")}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            border: "2px solid rgba(59, 130, 246, 0.6)",
            color: "#3B82F6",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            backgroundColor: "rgba(59, 130, 246, 0.3)",
            "&:hover": {
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              border: "2px solid rgba(59, 130, 246, 0.8)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
