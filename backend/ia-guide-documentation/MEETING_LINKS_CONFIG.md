# 📹 Configuração de Links de Reunião

Este documento explica como configurar e alternar entre diferentes tipos de links de reunião no MedFlow.

## 🎯 **Tipos de Links Disponíveis**

### 1. **Google Meet (Padrão)**

- **Tipo**: `google_meet`
- **Formato**: `https://meet.google.com/xxx-xxxx-xxx`
- **Geração**: Códigos únicos baseados no agendamento

### 2. **URL Customizada (Futuro)**

- **Tipo**: `custom_url`
- **Formato**: `https://meet.medflow.com/room/xxx`
- **Configurável**: Base URL personalizada

### 3. **Plataforma Externa (Extensível)**

- **Tipo**: `external_platform`
- **Exemplos**: Zoom, Teams, etc.
- **Configurável**: Através de novas estratégias

## ⚙️ **Configuração (.env)**

```bash
# Tipo de link padrão
MEETING_LINK_TYPE=google_meet

# URL base para links customizados
CUSTOM_MEETING_BASE_URL=https://meet.medflow.com

# Habilitar plataforma customizada
ENABLE_CUSTOM_MEETING_PLATFORM=false
```

## 🔄 **Como Alternar Estratégias**

### **Opção 1: Variável de Ambiente**

```bash
# Para Google Meet (atual)
MEETING_LINK_TYPE=google_meet

# Para URLs customizadas (futuro)
MEETING_LINK_TYPE=custom_url
```

### **Opção 2: Endpoint da API**

```bash
# Verificar estratégias disponíveis
GET /appointments/meeting-strategies

# Resposta:
{
  "current": "google_meet",
  "available": ["google_meet", "custom_url"],
  "configuration": {
    "meetingLinkType": "google_meet",
    "customMeetingBaseUrl": "https://meet.medflow.com",
    "enableCustomMeetingPlatform": false
  }
}
```

## 🏗️ **Arquitetura**

### **Strategy Pattern**

- `MeetingLinkStrategy`: Interface base
- `GoogleMeetStrategy`: Implementação para Google Meet
- `CustomUrlStrategy`: Implementação para URLs customizadas
- `MeetingLinkFactory`: Factory para selecionar estratégia

### **Extensibilidade**

Para adicionar nova estratégia:

1. **Criar nova strategy**:

```typescript
@Injectable()
export class ZoomStrategy implements MeetingLinkStrategy {
  // Implementação
}
```

2. **Registrar no factory**:

```typescript
this.strategies.set("zoom", this.zoomStrategy);
```

3. **Adicionar no módulo**:

```typescript
providers: [
  // ... existing
  ZoomStrategy,
];
```

## 🧪 **Testando**

```bash
# Testar geração de link
POST /appointments/:id/meet-link

# Verificar estratégias
GET /appointments/meeting-strategies

# Criar agendamento (link gerado automaticamente)
POST /appointments
```

## 🚀 **Migração Futura**

Para migrar para URLs customizadas:

1. **Configurar nova URL base**:

```bash
CUSTOM_MEETING_BASE_URL=https://sua-plataforma.com
```

2. **Alterar tipo padrão**:

```bash
MEETING_LINK_TYPE=custom_url
```

3. **Reiniciar aplicação**
4. **Novos agendamentos** usarão a nova estratégia
5. **Agendamentos existentes** manterão seus links originais

## 📊 **Benefícios da Arquitetura**

- ✅ **Flexibilidade**: Fácil troca de estratégias
- ✅ **Extensibilidade**: Adicionar novas plataformas
- ✅ **Retrocompatibilidade**: Links existentes continuam funcionando
- ✅ **Configurabilidade**: Controle via variáveis de ambiente
- ✅ **Testabilidade**: Cada estratégia pode ser testada isoladamente
