import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Base } from "./tipos.ts";

const CAMINHO = resolve(process.cwd(), "data/clinicas.json");

const VAZIA: Base = { atualizadoEm: new Date(0).toISOString(), clinicas: [], auditorias: [] };

export async function carregar(): Promise<Base> {
  try {
    const bruto = await readFile(CAMINHO, "utf8");
    const base = JSON.parse(bruto) as Partial<Base>;
    return {
      atualizadoEm: base.atualizadoEm ?? VAZIA.atualizadoEm,
      clinicas: base.clinicas ?? [],
      auditorias: base.auditorias ?? [],
    };
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(VAZIA);
    throw erro;
  }
}

export async function salvar(base: Base): Promise<void> {
  base.atualizadoEm = new Date().toISOString();
  await mkdir(dirname(CAMINHO), { recursive: true });
  await writeFile(CAMINHO, JSON.stringify(base, null, 2) + "\n", "utf8");
}

export function caminhoBase(): string {
  return CAMINHO;
}
