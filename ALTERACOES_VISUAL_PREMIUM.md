# Comparainvest — atualização visual premium/institucional

## Objetivo
Aplicar a direção visual discutida: aparência mais próxima de fintech/corretora premium, reduzindo excesso de neon, visual infantil, emojis e fonte serifada/retro.

## Arquivos alterados

1. `src/lib/theme.js`
   - Nova paleta premium em azul petróleo.
   - Verde menos fluorescente e mais sofisticado.
   - Bordas mais sutis via `rgba`.
   - Tipografia principal migrada para `Inter`.
   - `TN` passa a apontar para a fonte principal, evitando serifada antiga.
   - Botões e cards globais mais sóbrios.

2. `src/app/layout.js`
   - Troca das fontes carregadas para `Inter` + `JetBrains Mono`.
   - `theme-color` ajustado para o fundo premium `#071018`.

3. `src/app/globals.css`
   - Fundo global mais refinado.
   - Suavização de fonte.
   - Scrollbar mais discreta.
   - Seleção de texto alinhada com a marca.

4. `src/components/HomePage.jsx`
   - Reescrita visual da home.
   - Cards mais institucionais.
   - Remoção de dependência visual de ícones/emoji.
   - Títulos mais fortes, curtos e premium.
   - Botões mais sóbrios.

5. `src/components/Banners.jsx`
   - Banners de Diagnóstico redesenhados.
   - Menos neon, mais profundidade.
   - Card com badge visual sutil em vez de emoji.

6. `src/components/UpgradeModal.jsx`
   - Modal premium redesenhado.
   - Fundo com blur e card sofisticado.
   - CTA alterado para “Liberar acesso completo”.
   - Botão mais sóbrio e visual menos infantil.

7. `src/components/GestaoAtiva.jsx`
   - Mantido o ajuste do resumo em uma linha: Profissão / Renda / Fixas / Disponível.
   - Ajustado R$ com espaçamento menor.
   - Banner de plano atual oculto para Premium/Admin.
   - Copy de limite suavizada.
   - Pequeno ajuste no empty state.

8. `src/components/ComparatorPage.jsx`
   - Paywall textual suavizado.
   - CTA de premium alterado para “Liberar acesso completo”.
   - Remove “⚡ Plano Atual” para tom mais institucional.

9. `src/components/ComparadorRF.jsx`
   - Link antigo do Stripe substituído por `/premium`.
   - Paywall textual suavizado.
   - CTA de premium alterado para “Liberar acesso completo”.

## Arquivos NÃO alterados
- `src/data/*`
- `src/lib/engine.js`
- `src/lib/brapi.js`
- `src/lib/supabase.js`
- `src/lib/lgpd.js`
- componentes de cálculo/dados que não impactavam diretamente a direção visual.

## Observação
Esta atualização prioriza mudança visual segura e incremental, sem mexer nas regras de negócio principais.
