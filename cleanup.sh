#!/bin/bash

echo "🧹 Iniciando limpeza de arquivos duplicados e não utilizados..."

# Arquivos TypeScript não utilizados
echo "📝 Removendo arquivos TypeScript duplicados..."
rm -f src/App.tsx
rm -f src/main.tsx
rm -f src/App.css
rm -f src/vite-env.d.ts

# Componentes duplicados em pages/
echo "📦 Removendo componentes duplicados..."
rm -f src/pages/KPICard.jsx
rm -f src/pages/SummaryTable.jsx

# Layouts duplicados
echo "🎨 Removendo layouts duplicados..."
rm -rf src/pages/Layouts/

# Estilos duplicados
echo "💅 Removendo estilos duplicados..."
rm -f src/styles/index.css
rmdir src/styles/ 2>/dev/null

# Assets não utilizados
echo "🖼️  Removendo assets não utilizados..."
rm -f src/assets/react.svg

# Diretório vazio
echo "📁 Removendo diretórios vazios..."
rm -rf src/components/layout/nada/

# Componentes UI não utilizados (opcional - comentado por segurança)
echo "⚠️  Componentes UI shadcn não removidos (verificar uso antes)"
# Descomente as linhas abaixo se tiver certeza que não são usados:
# rm -f src/components/ui/accordion.tsx
# rm -f src/components/ui/alert-dialog.tsx
# rm -f src/components/ui/alert.tsx
# rm -f src/components/ui/aspect-ratio.tsx
# rm -f src/components/ui/breadcrumb.tsx
# rm -f src/components/ui/carousel.tsx
# rm -f src/components/ui/collapsible.tsx
# rm -f src/components/ui/command.tsx
# rm -f src/components/ui/context-menu.tsx
# rm -f src/components/ui/drawer.tsx
# rm -f src/components/ui/hover-card.tsx
# rm -f src/components/ui/input-otp.tsx
# rm -f src/components/ui/menubar.tsx
# rm -f src/components/ui/navigation-menu.tsx
# rm -f src/components/ui/pagination.tsx
# rm -f src/components/ui/radio-group.tsx
# rm -f src/components/ui/resizable.tsx
# rm -f src/components/ui/scroll-area.tsx
# rm -f src/components/ui/sheet.tsx
# rm -f src/components/ui/sidebar.tsx
# rm -f src/components/ui/skeleton.tsx
# rm -f src/components/ui/slider.tsx
# rm -f src/components/ui/sonner.tsx
# rm -f src/components/ui/toggle-group.tsx
# rm -f src/components/ui/toggle.tsx

echo "✅ Limpeza concluída!"
echo ""
echo "📊 Resumo:"
echo "  - Arquivos TypeScript duplicados: removidos"
echo "  - Componentes duplicados: removidos"
echo "  - Layouts duplicados: removidos"
echo "  - Assets não utilizados: removidos"
echo "  - Diretórios vazios: removidos"
echo ""
echo "⚠️  Lembre-se de:"
echo "  1. Verificar se a aplicação ainda funciona"
echo "  2. Atualizar imports se necessário"
echo "  3. Fazer commit das mudanças"
