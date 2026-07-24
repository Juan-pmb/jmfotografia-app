export function formatearTexto(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((palabra) =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1),
    )
    .join(" ");
}