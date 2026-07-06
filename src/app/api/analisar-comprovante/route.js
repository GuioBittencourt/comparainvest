import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const curMes = () => {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
}

export async function POST(request) {
  try {
    const { imageBase64, mimeType, userId, isPremium, mode } = await request.json()
    // mode: 'comprovante' | 'fatura'

    if (!imageBase64 || !userId) {
      return Response.json({ ok: false, error: 'Dados incompletos' }, { status: 400 })
    }

    // Verificar e controlar limite de uso (só para comprovante, fatura é premium only)
    if (mode === 'comprovante') {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('foto_uses_count, foto_uses_month, is_premium, is_admin')
        .eq('id', userId)
        .single()

      if (error) return Response.json({ ok: false, error: 'Usuário não encontrado' }, { status: 404 })

      const mes = curMes()
      const isPremiumReal = profile.is_premium || profile.is_admin || isPremium
      const countAtual = profile.foto_uses_month === mes ? (profile.foto_uses_count || 0) : 0

      if (!isPremiumReal && countAtual >= 5) {
        return Response.json({
          ok: false,
          error: 'limite_atingido',
          message: 'Você usou suas 5 leituras gratuitas do mês. Faça upgrade para Premium e use sem limite.'
        }, { status: 403 })
      }

      // Atualizar contador
      await supabase
        .from('profiles')
        .update({
          foto_uses_count: countAtual + 1,
          foto_uses_month: mes
        })
        .eq('id', userId)
    } else if (mode === 'fatura') {
      // Fatura é Premium only
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium, is_admin')
        .eq('id', userId)
        .single()

      if (!profile?.is_premium && !profile?.is_admin) {
        return Response.json({
          ok: false,
          error: 'premium_required',
          message: 'Análise de fatura é exclusiva do plano Premium.'
        }, { status: 403 })
      }
    }

    // Prompts por modo
    const prompt = mode === 'fatura'
      ? `Esta é uma fatura de cartão de crédito brasileira. Analise todos os lançamentos e responda SOMENTE em JSON válido, sem markdown:
{
  "totalFatura": 0.00,
  "totalParcelado": 0.00,
  "totalAVista": 0.00,
  "categorias": [
    { "nome": "Alimentação", "total": 0.00, "percentual": 0.0, "itens": ["descrição - R$ valor"] }
  ],
  "topGastos": ["descrição - R$ valor"],
  "alertas": ["texto do alerta"],
  "diagnostico": "parágrafo curto com análise crítica dos gastos",
  "sugestoes": ["sugestão prática para reduzir dependência do cartão"]
}`
      : `Este é um comprovante de pagamento ou nota fiscal brasileiro. Extraia os dados e responda SOMENTE em JSON válido, sem markdown:
{
  "tipo": "despesa ou receita",
  "valor": 0.00,
  "descricao": "descrição curta do gasto",
  "categoria": "uma das opções: Mercado / Alimentação | Transporte / Gasolina | Diversão / Lazer | Saúde / Farmácia | Pets | Cursos e Livros | Outros",
  "estabelecimento": "nome do estabelecimento se visível",
  "data": "DD/MM/AAAA se visível ou null",
  "confianca": "alta | media | baixa"
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: mode === 'fatura' ? 2000 : 500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType || 'image/jpeg', data: imageBase64 }
            },
            { type: 'text', text: prompt }
          ]
        }]
      })
    })

    const data = await response.json()
    if (!data.content?.[0]?.text) {
      return Response.json({ ok: false, error: 'Resposta inválida da IA' }, { status: 500 })
    }

    const text = data.content[0].text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(text)

    return Response.json({ ok: true, data: parsed })

  } catch (err) {
    console.error('Erro analisar-comprovante:', err)
    return Response.json({ ok: false, error: 'Erro interno' }, { status: 500 })
  }
}