import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface ContactNotificationProps {
  name?: string
  email?: string
  phone?: string
  projectType?: string
  message?: string
}

export function ContactNotification({
  name = 'Visitante',
  email = 'sem-email@exemplo.com',
  phone = '—',
  projectType = '—',
  message = '—',
}: ContactNotificationProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>{`Novo contato de ${name}`}</Preview>
      <Body style={{ backgroundColor: '#0b0b0c', margin: 0, padding: '24px 0', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', backgroundColor: '#141416', borderRadius: '12px', padding: '28px' }}>
          <Heading style={{ color: '#d9b25a', fontSize: '20px', margin: '0 0 4px' }}>
            Novo contato pelo site
          </Heading>
          <Text style={{ color: '#9a9a9f', fontSize: '13px', margin: '0 0 20px' }}>
            EFC Tecnologia — formulário de contato
          </Text>
          <Hr style={{ borderColor: '#2a2a2e', margin: '0 0 20px' }} />
          <Section>
            <Text style={{ color: '#e8e8ea', fontSize: '14px', margin: '0 0 8px' }}>
              <strong>Nome:</strong> {name}
            </Text>
            <Text style={{ color: '#e8e8ea', fontSize: '14px', margin: '0 0 8px' }}>
              <strong>E-mail:</strong> {email}
            </Text>
            <Text style={{ color: '#e8e8ea', fontSize: '14px', margin: '0 0 8px' }}>
              <strong>Telefone:</strong> {phone}
            </Text>
            <Text style={{ color: '#e8e8ea', fontSize: '14px', margin: '0 0 16px' }}>
              <strong>Tipo de projeto:</strong> {projectType}
            </Text>
            <Text style={{ color: '#e8e8ea', fontSize: '14px', margin: '0 0 6px' }}>
              <strong>Mensagem:</strong>
            </Text>
            <Text style={{ color: '#c9c9ce', fontSize: '14px', lineHeight: '22px', whiteSpace: 'pre-wrap', margin: 0 }}>
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactNotification,
  displayName: 'Contato do site',
  subject: (data: Record<string, any>) => `Novo contato de ${data['name'] ?? 'visitante'}`,
  to: 'eric.filipe@hotmail.com',
  previewData: {
    name: 'Maria Souza',
    email: 'maria@exemplo.com',
    phone: '(79) 99999-0000',
    projectType: 'Aplicativo mobile',
    message: 'Gostaria de um orçamento para um app de gestão.',
  },
} satisfies TemplateEntry
