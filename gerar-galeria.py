import os
import json

# Pasta raiz das fotos
BASE_DIR = os.path.join("assets", "img", "portfolio")

# Categorias e seus labels de exibição
CATEGORIAS = {
    "newborn":  "Newborn",
    "gestante": "Gestante",
    "familia":  "Família",
}

# Extensões aceitas
EXTENSOES = (".jpg", ".jpeg", ".png", ".webp")

fotos = []

for pasta, label in CATEGORIAS.items():
    caminho = os.path.join(BASE_DIR, pasta)
    if not os.path.isdir(caminho):
        print(f"⚠️  Pasta não encontrada: {caminho} (pulando...)")
        continue

    arquivos = sorted([
        f for f in os.listdir(caminho)
        if f.lower().endswith(EXTENSOES)
    ])

    for arquivo in arquivos:
        fotos.append({
            "src":      f"assets/img/portfolio/{pasta}/{arquivo}",
            "category": pasta,
            "label":    label,
            "alt":      f"Ensaio {label}"
        })

    print(f"✅  {pasta}: {len(arquivos)} foto(s) encontrada(s)")

# Salva o JSON
output = "galeria.json"
with open(output, "w", encoding="utf-8") as f:
    json.dump(fotos, f, ensure_ascii=False, indent=2)

print(f"\n🎉 galeria.json gerado com {len(fotos)} foto(s) no total!")