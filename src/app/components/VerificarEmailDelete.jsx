import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export default function VerificarEmailDelete({user, url}) {
  return (
        <Html>
            <Head />
            <Preview>Confirme a exclusão da sua conta</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Confirme a exclusão da sua conta</Heading>
                    <Text style={text}>Olá {user.name},</Text>
                    <Text style={text}>
                        Sentiremos sua falta! Para confirmar a exclusão da sua conta, por favor clique no botão abaixo.
                    </Text>
                    <Section style={buttonContainer}>
                    <Button style={button} href={url}>
                        Confirmar Exclusão
                    </Button>
                    </Section>
                    <Text style={text}>
                        Ou copie e cole este link no seu navegador:
                    </Text>
                    <Link href={url} style={link}>
                        {url}
                    </Link>
                    <Text style={footer}>
                        Este link expira em 24 horas. Se você não solicitou esta exclusão,
                        pode ignorar este email com segurança.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
  backgroundColor: '#f6f9fc',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '580px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
};

const buttonContainer = {
  padding: '27px 0',
  textAlign: 'center',
};

const button = {
  backgroundColor: '#0f1729',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
  width: '200px',
  padding: '14px 0',
  margin: '0 auto',
  cursor: 'pointer',
};

const link = {
  color: '#0f1729',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all',
  padding: '0 40px',
  display: 'block',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '32px',
};