/**
 * Utilitários para tratamento seguro de valores
 */

/**
 * Obtém o valor de uma propriedade ou um valor padrão se undefined/null
 * 
 * @param value - Valor a ser verificado
 * @param defaultValue - Valor padrão
 * @returns Valor ou padrão
 */
export function safeValue<T>(value: T | undefined | null, defaultValue: T): T {
    return value ?? defaultValue;
}

/**
 * Converte string para lowercase de forma segura
 * 
 * @param value - String a ser convertida
 * @returns String em lowercase ou string vazia
 */
export function safeToLowerCase(value: string | undefined | null): string {
    return value?.toLowerCase() || '';
}

/**
 * Compara duas strings de forma segura
 * 
 * @param a - Primeira string
 * @param b - Segunda string
 * @returns Resultado da comparação
 */
export function safeStringCompare(a: string | undefined | null, b: string | undefined | null): number {
    const strA = a || '';
    const strB = b || '';
    return strA.localeCompare(strB);
}

/**
 * Verifica se uma string contém outra de forma segura
 * 
 * @param haystack - String onde procurar
 * @param needle - String a procurar
 * @returns true se encontrado
 */
export function safeStringIncludes(haystack: string | undefined | null, needle: string): boolean {
    return safeToLowerCase(haystack).includes(needle.toLowerCase());
}

/**
 * Formata uma string para exibição com fallback
 * 
 * @param value - Valor a ser formatado
 * @param fallback - Texto de fallback
 * @returns String formatada
 */
export function safeDisplay(value: string | undefined | null, fallback: string): string {
    return value || fallback;
} 