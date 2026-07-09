import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'guilherme_fvb@hotmail.com'

export async function POST(request) {
  try {
    const { userId, linkId } = await request.json()
    if (!userId || !linkId) return Response.json({ ok: false }, { status: 400 })

    // Registra o clique
    const { data: clique } = await supabase
      .from('link_cliques')
      .insert({ user_id: userId, link_id: linkId })
      .select()
      .single()

    // Busca dados do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome, sobrenome, celular, email')
      .eq('id', userId)
      .single()

    if (!profile || !clique) return Response.json({ ok: true })

    // Agenda notificação para 24h depois via Supabase (salva timestamp)
    // O e-mail é enviado pela rota /api/verificar-notificacoes chamada pelo cron ou pelo ADM
    await supabase
      .from('link_cliques')
      .update({ notificado_at: null })
      .eq('id', clique.id)

    return Response.json({ ok: true })
  } catch (err) {
    console.error('notificar-clique error:', err)
    return Response.json({ ok: false }, { status: 500 })
  }
}

// Rota GET: verifica cliques com 24h+ sem notificação e envia e-mail
export async function GET() {
  try {
    const limite = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: cliques } = await supabase
      .from('link_cliques')
      .select('id, user_id, link_id, clicked_at, profiles(nome, sobrenome, celular)')
      .is('notificado_at', null)
      .lt('clicked_at', limite)

    if (!cliques || cliques.length === 0) return Response.json({ ok: true, enviados: 0 })

    let enviados = 0
    for (const c of cliques) {
      const nome = c.profiles ? `${c.profiles.nome} ${c.profiles.sobrenome || ''}`.trim() : 'Usuário'
      const celular = c.profiles?.celular || 'não informado'
      const quando = new Date(c.clicked_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      const link = c.link_id === 'alavancagem' ? 'Aula de Alavancagem Patrimonial' : 'Card de Consórcio'

      // Envia e-mail via Resend (ou nodemailer se preferir)
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'comparainvest <noreply@comparainvest.com.br>',
          to: [ADMIN_EMAIL],
          subject: `Lead quente: ${nome} clicou em ${link}`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #06090F; color: #fff; border-radius: 12px;">
              <h2 style="color: #00E5A0; margin: 0 0 16px">Lead quente 🔥</h2>
              <p style="color: #94A3B8; margin: 0 0 20px">Um usuário clicou no link <strong style="color: #fff">${link}</strong> há mais de 24 horas. Hora de entrar em contato!</p>
              <div style="background: #0D1117; border: 1px solid #1E293B; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
                <div style="margin-bottom: 10px;"><span style="color: #94A3B8; font-size: 11px">NOME</span><br><strong style="color: #fff">${nome}</strong></div>
                <div style="margin-bottom: 10px;"><span style="color: #94A3B8; font-size: 11px">CELULAR</span><br><strong style="color: #fff">${celular}</strong></div>
                <div><span style="color: #94A3B8; font-size: 11px">CLICOU EM</span><br><strong style="color: #fff">${quando}</strong></div>
              </div>
              <a href="https://wa.me/55${celular.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(nome)}%2C%20vi%20que%20voc%C3%AA%20assistiu%20nossa%20aula%20no%20comparainvest.%20O%20que%20achou%3F"
                style="display: block; text-align: center; padding: 12px; background: #25D166; color: #000; border-radius: 8px; text-decoration: none; font-weight: 700;">
                Chamar no WhatsApp →
              </a>
            </div>
          `,
        }),
      })

      // Marca como notificado
      await supabase
        .from('link_cliques')
        .update({ notificado_at: new Date().toISOString() })
        .eq('id', c.id)

      enviados++
    }

    return Response.json({ ok: true, enviados })
  } catch (err) {
    console.error('verificar-notificacoes error:', err)
    return Response.json({ ok: false }, { status: 500 })
  }
}