/**
 * Utilitários para manipulação de datas
 */

/**
 * Formata data para exibição no formato brasileiro
 * 
 * @param dateString - String da data
 * @returns Data formatada
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

/**
 * Verifica se uma data está expirada
 * 
 * @param dateString - String da data
 * @returns true se expirada
 */
export function isExpired(dateString: string): boolean {
    return new Date(dateString) < new Date();
}

/**
 * Calcula idade baseada na data de nascimento
 * 
 * @param dateOfBirth - Data de nascimento
 * @returns Idade em anos
 */
export function calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

/**
 * Verifica se uma data é válida
 * 
 * @param dateString - String da data
 * @returns true se válida
 */
export function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Obtém a diferença em dias entre duas datas
 * 
 * @param date1 - Primeira data
 * @param date2 - Segunda data
 * @returns Diferença em dias
 */
export function getDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
} 