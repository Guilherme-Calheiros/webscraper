export function formatarMoeda(valor) {
  if (valor == null) return '';
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}