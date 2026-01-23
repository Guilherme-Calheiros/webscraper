export function formatarMoeda(valor) {
  valor = Number(valor);
  if (valor == null) return '';
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}